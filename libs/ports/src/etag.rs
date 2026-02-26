use domain::vault::{Etag, VaultPackage};

#[cfg_attr(any(test, feature = "testing"), mockall::automock)]
pub trait EtagGenerator: Send + Sync {
    fn generate(&self, package: &VaultPackage) -> Etag;
}
