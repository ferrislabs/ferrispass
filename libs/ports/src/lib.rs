use thiserror::Error;

pub mod vault_repository;

#[derive(Debug, Error)]
pub enum RepositoryError {
    #[error("not found: {message}")]
    NotFound { message: String },
}
