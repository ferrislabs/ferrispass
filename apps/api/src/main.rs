use std::error::Error;

use clap::Parser;

use crate::args::Args;

pub mod args;

fn main() -> Result<(), Box<dyn Error>> {
    dotenvy::dotenv()?;

    let _args = Args::parse();

    Ok(())
}
