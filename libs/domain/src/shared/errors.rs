use thiserror::Error;

#[derive(Debug, Clone, Error)]
pub enum DomainError {
    #[error("resource not found: {resource}")]
    NotFound { resource: String },

    #[error("conflict: expected '{expected}', but got '{actual}'")]
    Conflict { expected: String, actual: String },

    #[error("validation error: {field} - {message}")]
    Validation {
        field: &'static str,
        message: String,
    },
}
