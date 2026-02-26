use domain::vault::{Etag, OwnerSub, Vault};

use crate::RepositoryError;

#[cfg_attr(any(test, feature = "testing"), mockall::automock)]
pub trait VaultRepository: Send + Sync {
    fn find_by_owner(
        &self,
        owner_id: &OwnerSub,
    ) -> impl Future<Output = Result<Option<Vault>, RepositoryError>> + Send;

    fn create(&self, vault: &Vault) -> impl Future<Output = Result<(), RepositoryError>> + Send;

    fn update_if_match(
        &self,
        vault: &Vault,
        expected_etag: &Etag,
    ) -> impl Future<Output = Result<(), RepositoryError>> + Send;
}
