use thiserror::Error;

pub mod etag;
pub mod vault_repository;

#[derive(Debug, Error)]
pub enum RepositoryError {
    #[error("vault not found for owner {owner}")]
    VaultNotFound { owner: String },

    #[error("concurrency conflict for vault {vault_id}")]
    ConcurrencyConflict { vault_id: String },

    #[error("database error: {message}")]
    Database { message: String },
}
