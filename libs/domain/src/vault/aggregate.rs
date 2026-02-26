use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::{
    shared::errors::DomainError,
    vault::{
        package::VaultPackage,
        value_objects::{Etag, OwnerSub, Revision, VaultId},
    },
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vault {
    pub id: VaultId,
    pub owner_id: OwnerSub,

    pub package: VaultPackage,

    pub revision: Revision,
    pub etag: Etag,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Vault {
    pub fn new(
        id: VaultId,
        owner_id: OwnerSub,
        now: DateTime<Utc>,
        etag: Etag,
        initial_package: VaultPackage,
    ) -> Result<Self, DomainError> {
        initial_package.validate()?;

        Ok(Self {
            id,
            owner_id,
            package: initial_package,
            revision: Revision::INITIAL,
            etag,
            created_at: now,
            updated_at: now,
        })
    }

    pub fn update(
        &self,
        expected_etag: &Etag,
        now: DateTime<Utc>,
        new_etag: Etag,
        new_package: VaultPackage,
    ) -> Result<Self, DomainError> {
        new_package.validate()?;

        if &self.etag != expected_etag {
            return Err(DomainError::Conflict {
                expected: expected_etag.0.clone(),
                actual: self.etag.0.clone(),
            });
        }

        // Invariant: etag doit changer (sinon update inutile / bug client)
        if new_etag == self.etag {
            return Err(DomainError::Validation {
                field: "etag",
                message: "must change on update".into(),
            });
        }

        Ok(Self {
            id: self.id,
            owner_id: self.owner_id.clone(),
            package: new_package,
            revision: self.revision.next(),
            etag: new_etag,
            created_at: self.created_at,
            updated_at: now,
        })
    }
}

#[cfg(test)]
mod tests {
    use chrono::Utc;
    use uuid::Uuid;

    use crate::{
        shared::errors::DomainError,
        vault::{
            aggregate::Vault,
            header::{KdfAlg, KdfParams, KdfSpec, VaultHeader},
            package::{CipherBlob, VaultPackage},
            value_objects::{CryptoVersion, Etag, OwnerSub, Revision, VaultId},
        },
    };

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

    fn valid_vault() -> Vault {
        Vault::new(
            VaultId(Uuid::new_v4()),
            OwnerSub::new("user-123").unwrap(),
            Utc::now(),
            Etag::new("etag-1").unwrap(),
            valid_package(),
        )
        .unwrap()
    }

    #[test]
    fn create_vault_success() {
        let vault = valid_vault();
        assert_eq!(vault.revision, Revision::INITIAL);
    }

    #[test]
    fn update_success_increments_revision() {
        let vault = valid_vault();
        let now = Utc::now();

        let updated = vault
            .update(
                &Etag::new("etag-1").unwrap(),
                now,
                Etag::new("etag-2").unwrap(),
                valid_package(),
            )
            .unwrap();

        assert_eq!(updated.revision.0, 1);
        assert_eq!(updated.etag.0, "etag-2");
    }

    #[test]
    fn update_fails_on_wrong_etag() {
        let vault = valid_vault();

        let result = vault.update(
            &Etag::new("wrong").unwrap(),
            Utc::now(),
            Etag::new("etag-2").unwrap(),
            valid_package(),
        );

        assert!(matches!(result, Err(DomainError::Conflict { .. })));
    }

    #[test]
    fn update_fails_if_etag_not_changed() {
        let vault = valid_vault();

        let result = vault.update(
            &Etag::new("etag-1").unwrap(),
            Utc::now(),
            Etag::new("etag-1").unwrap(),
            valid_package(),
        );

        assert!(result.is_err());
    }
}
