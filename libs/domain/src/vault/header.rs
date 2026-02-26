use serde::{Deserialize, Serialize};

use crate::{shared::errors::DomainError, vault::value_objects::CryptoVersion};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KdfParams {
    pub m_kib: u32, // memory cost in KiB
    pub t: u32,     // time cost
    pub p: u32,     // parallelization factor
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum KdfAlg {
    Argon2id,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KdfSpec {
    pub alg: KdfAlg,
    pub salt: Vec<u8>,
    pub params: KdfParams,
}

impl KdfSpec {
    pub fn validate(&self) -> Result<(), DomainError> {
        if self.salt.len() < 16 {
            return Err(DomainError::Validation {
                field: "kdf.salt",
                message: "must be at least 16 bytes".into(),
            });
        }

        if self.params.m_kib < 32 * 1024 {
            return Err(DomainError::Validation {
                field: "kdf.params.m_kib",
                message: "must be at least 32 MiB (32768 KiB)".into(),
            });
        }

        if self.params.t < 1 {
            return Err(DomainError::Validation {
                field: "kdf.params.t",
                message: "must be at least 1".into(),
            });
        }

        if self.params.p < 1 {
            return Err(DomainError::Validation {
                field: "kdf.params.p",
                message: "must be at least 1".into(),
            });
        }

        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VaultHeader {
    pub crypto_version: CryptoVersion,
    pub kdf: KdfSpec,
    pub wrapped_vault_key: Vec<u8>,
}

impl VaultHeader {
    pub fn validate(&self) -> Result<(), DomainError> {
        self.kdf.validate()?;

        if self.wrapped_vault_key.len() < 32 {
            return Err(DomainError::Validation {
                field: "wrapped_vault_key",
                message: "too small (min 32 bytes)".into(),
            });
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::vault::header::{KdfAlg, KdfParams, KdfSpec};

    #[test]
    fn salt_must_be_minimum_size() {
        let spec = KdfSpec {
            alg: KdfAlg::Argon2id,
            salt: vec![1; 8],
            params: KdfParams {
                m_kib: 131_072,
                t: 3,
                p: 1,
            },
        };

        assert!(spec.validate().is_err());
    }

    #[test]
    fn memory_must_be_sufficient() {
        let spec = KdfSpec {
            alg: KdfAlg::Argon2id,
            salt: vec![1; 16],
            params: KdfParams {
                m_kib: 1024,
                t: 3,
                p: 1,
            },
        };

        assert!(spec.validate().is_err());
    }
}
