use thiserror::Error;

#[derive(Debug, Clone, Error)]
pub enum DomainError {
    #[error("vault {vault_id} not found")]
    VaultNotFound { vault_id: String },

    #[error("etag mismatch on vault {vault_id}: expected {expected}, actual {actual}")]
    ConcurrencyConflict {
        vault_id: String,
        expected: String,
        actual: String,
    },

    #[error("validation error on {field}: {message}")]
    Validation {
        field: &'static str,
        message: String,
    },
}
