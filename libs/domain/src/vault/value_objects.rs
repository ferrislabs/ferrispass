use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::shared::errors::DomainError;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct VaultId(pub Uuid);

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct OwnerSub(pub String);

impl OwnerSub {
    pub fn new(value: impl Into<String>) -> Result<Self, DomainError> {
        let s = value.into();

        if s.trim().is_empty() {
            return Err(DomainError::Validation {
                field: "owner_sub",
                message: "must not be empty".into(),
            });
        }

        Ok(Self(s))
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct Revision(pub u64);

impl Revision {
    pub const INITIAL: Self = Self(0);

    pub fn next(self) -> Self {
        Self(self.0.saturating_add(1))
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Etag(pub String);

impl Etag {
    pub fn new(value: impl Into<String>) -> Result<Self, DomainError> {
        let s = value.into();

        if s.trim().is_empty() {
            return Err(DomainError::Validation {
                field: "etag",
                message: "must not be empty".into(),
            });
        }

        Ok(Self(s))
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct CryptoVersion(pub u16);

impl CryptoVersion {
    pub const V1: Self = Self(1);

    pub fn new(v: u16) -> Result<Self, DomainError> {
        if v == 0 {
            return Err(DomainError::Validation {
                field: "crypto_version",
                message: "must be greater than 0".into(),
            });
        }

        Ok(Self(v))
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Timestamp(pub DateTime<Utc>);

#[cfg(test)]
mod tests {
    use crate::vault::value_objects::{CryptoVersion, OwnerSub, Revision};

    #[test]
    fn owner_sub_cannot_be_empty() {
        assert!(OwnerSub::new("").is_err());
    }

    #[test]
    fn revision_next_increments() {
        let r = Revision(5);
        assert_eq!(r.next().0, 6);
    }

    #[test]
    fn crypto_version_must_be_positive() {
        assert!(CryptoVersion::new(0).is_err());
        assert!(CryptoVersion::new(1).is_ok());
    }
}
