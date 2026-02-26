use serde::{Deserialize, Serialize};

use crate::{shared::errors::DomainError, vault::header::VaultHeader};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CipherBlob {
    pub nonce: Vec<u8>,
    pub aad: Vec<u8>,
    pub ciphertext: Vec<u8>,
}

impl CipherBlob {
    pub fn validate(&self) -> Result<(), DomainError> {
        if self.nonce.len() < 12 {
            return Err(DomainError::Validation {
                field: "blob.nonce",
                message: "nonce too small (min 12 bytes)".into(),
            });
        }

        if self.ciphertext.len() < 16 {
            return Err(DomainError::Validation {
                field: "blob.ciphertext",
                message: "ciphertext too small (min 16 bytes)".into(),
            });
        }

        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VaultPackage {
    pub header: VaultHeader,
    pub blob: CipherBlob,
}

impl VaultPackage {
    pub fn validate(&self) -> Result<(), DomainError> {
        self.header.validate()?;
        self.blob.validate()?;

        Ok(())
    }
}
