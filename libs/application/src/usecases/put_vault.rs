use chrono::{DateTime, Utc};
use domain::vault::{Etag, OwnerSub, VaultPackage};
use ports::{etag::EtagGenerator, vault_repository::VaultRepository};

use crate::errors::{AppError, Resource};

pub struct PutVault<R, E>
where
    R: VaultRepository,
    E: EtagGenerator,
{
    vault_repository: R,
    etag_generator: E,
}

impl<R, E> PutVault<R, E>
where
    R: VaultRepository,
    E: EtagGenerator,
{
    pub fn new(vault_repository: R, etag_generator: E) -> Self {
        Self {
            vault_repository,
            etag_generator,
        }
    }

    pub async fn execute(
        &self,
        owner_id: OwnerSub,
        expected_etag: Etag,
        package: VaultPackage,
        now: DateTime<Utc>,
    ) -> Result<(Etag, u64), AppError> {
        let existing = self
            .vault_repository
            .find_by_owner(&owner_id)
            .await?
            .ok_or(AppError::NotFound {
                resource: Resource::Vault,
                id: Some(owner_id.0.clone()),
            })?;

        let new_etag = self.etag_generator.generate(&package);

        let updated = existing.update(&expected_etag, now, new_etag.clone(), package)?;

        self.vault_repository
            .update_if_match(&updated, &expected_etag)
            .await?;

        Ok((updated.etag, updated.revision.0))
    }
}

#[cfg(test)]
mod tests {
    use chrono::Utc;
    use domain::vault::{
        CipherBlob, CryptoVersion, Etag, KdfAlg, KdfParams, KdfSpec, OwnerSub, Vault, VaultHeader,
        VaultId, VaultPackage,
    };

    use ports::{RepositoryError, etag::MockEtagGenerator, vault_repository::MockVaultRepository};
    use uuid::Uuid;

    use crate::{errors::AppError, usecases::put_vault::PutVault};

    fn valid_package() -> VaultPackage {
        VaultPackage {
            header: VaultHeader {
                crypto_version: CryptoVersion::V1,
                kdf: KdfSpec {
                    alg: KdfAlg::Argon2id,
                    salt: vec![1; 16],
                    params: KdfParams {
                        m_kib: 131_072,
                        t: 3,
                        p: 1,
                    },
                },
                wrapped_vault_key: vec![2; 32],
            },
            blob: CipherBlob {
                nonce: vec![3; 24],
                aad: vec![],
                ciphertext: vec![4; 32],
            },
        }
    }

    fn existing_vault() -> Vault {
        Vault::new(
            VaultId(Uuid::new_v4()),
            OwnerSub::new("user1").unwrap(),
            Utc::now(),
            Etag::new("etag-1").unwrap(),
            valid_package(),
        )
        .unwrap()
    }

    #[tokio::test]
    async fn returns_not_found_if_vault_missing() {
        let mut repo = MockVaultRepository::new();
        let etag_gen = MockEtagGenerator::new();

        repo.expect_find_by_owner()
            .returning(|_| Box::pin(async { Ok(None) }));

        let usecase = PutVault::new(repo, etag_gen);

        let result = usecase
            .execute(
                OwnerSub::new("user1").unwrap(),
                Etag::new("etag-1").unwrap(),
                valid_package(),
                Utc::now(),
            )
            .await;

        assert!(matches!(result, Err(AppError::NotFound { .. })))
    }

    #[tokio::test]
    async fn returns_conflict_if_etag_mismatch() {
        let mut repo = MockVaultRepository::new();
        let mut etag_gen = MockEtagGenerator::new();

        let vault = existing_vault();

        repo.expect_find_by_owner().returning(move |_| {
            let v = vault.clone();
            Box::pin(async move { Ok(Some(v)) })
        });

        etag_gen
            .expect_generate()
            .returning(|_| Etag::new("new-etag").unwrap());

        let usecase = PutVault::new(repo, etag_gen);

        let result = usecase
            .execute(
                OwnerSub::new("user1").unwrap(),
                Etag::new("wrong-etag").unwrap(),
                valid_package(),
                Utc::now(),
            )
            .await;

        assert!(matches!(result, Err(AppError::Conflict { .. })));
    }

    #[tokio::test]
    async fn returns_conflict_if_repository_conflict() {
        let mut repo = MockVaultRepository::new();
        let mut etag_gen = MockEtagGenerator::new();

        let vault = existing_vault();

        repo.expect_find_by_owner().returning(move |_| {
            let v = vault.clone();
            Box::pin(async move { Ok(Some(v)) })
        });

        etag_gen
            .expect_generate()
            .returning(|_| Etag::new("etag-2").unwrap());

        repo.expect_update_if_match().returning(|_, _| {
            Box::pin(async {
                Err(RepositoryError::ConcurrencyConflict {
                    vault_id: "some-id".into(),
                })
            })
        });

        let usecase = PutVault::new(repo, etag_gen);

        let result = usecase
            .execute(
                OwnerSub::new("user1").unwrap(),
                Etag::new("etag-1").unwrap(),
                valid_package(),
                Utc::now(),
            )
            .await;

        assert!(matches!(result, Err(AppError::Conflict { .. })));
    }

    #[tokio::test]
    async fn updates_vault_successfully() {
        let mut repo = MockVaultRepository::new();
        let mut etag_gen = MockEtagGenerator::new();

        let vault = existing_vault();

        repo.expect_find_by_owner().returning(move |_| {
            let v = vault.clone();
            Box::pin(async move { Ok(Some(v)) })
        });

        etag_gen
            .expect_generate()
            .returning(|_| Etag::new("etag-2").unwrap());

        repo.expect_update_if_match()
            .returning(|_, _| Box::pin(async { Ok(()) }));

        let usecase = PutVault::new(repo, etag_gen);

        let (new_etag, new_revision) = usecase
            .execute(
                OwnerSub::new("user1").unwrap(),
                Etag::new("etag-1").unwrap(),
                valid_package(),
                Utc::now(),
            )
            .await
            .unwrap();

        assert_eq!(new_etag.0, "etag-2");
        assert_eq!(new_revision, 1);
    }
}
