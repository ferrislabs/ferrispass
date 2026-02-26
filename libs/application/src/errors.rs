use std::fmt::Display;

use domain::DomainError;
use ports::RepositoryError;
use thiserror::Error;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Resource {
    Vault,
}

impl Display for Resource {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Resource::Vault => write!(f, "vault"),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ConflictKind {
    Concurrency, // ETag / revision mismatch
    AlreadyExists,
}

impl Display for ConflictKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ConflictKind::Concurrency => write!(f, "concurrency"),
            ConflictKind::AlreadyExists => write!(f, "already_exists"),
        }
    }
}

#[derive(Debug, Error)]
pub enum AppError {
    #[error("{resource} not found")]
    NotFound {
        resource: Resource,
        id: Option<String>,
    },

    #[error("{kind} conflict on {resource}")]
    Conflict {
        kind: ConflictKind,
        resource: Resource,
        id: Option<String>,
    },

    #[error("validation error on {field}: {message}")]
    Validation {
        field: &'static str,
        message: String,
    },

    #[error("infrastructure error: {message}")]
    Infrastructure { message: String },
}

impl From<DomainError> for AppError {
    fn from(e: DomainError) -> Self {
        match e {
            DomainError::VaultNotFound { vault_id } => AppError::NotFound {
                resource: Resource::Vault,
                id: Some(vault_id),
            },

            DomainError::ConcurrencyConflict {
                vault_id,
                expected: _,
                actual: _,
            } => AppError::Conflict {
                kind: ConflictKind::Concurrency,
                resource: Resource::Vault,
                id: Some(vault_id),
            },

            DomainError::Validation { field, message } => AppError::Validation { field, message },
        }
    }
}

impl From<RepositoryError> for AppError {
    fn from(e: RepositoryError) -> Self {
        match e {
            RepositoryError::VaultNotFound { owner } => AppError::NotFound {
                resource: Resource::Vault,
                id: Some(owner),
            },

            RepositoryError::ConcurrencyConflict { vault_id } => AppError::Conflict {
                kind: ConflictKind::Concurrency,
                resource: Resource::Vault,
                id: Some(vault_id),
            },

            RepositoryError::Database { message } => AppError::Infrastructure { message },
        }
    }
}
