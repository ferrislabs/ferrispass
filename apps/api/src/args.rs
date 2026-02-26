use clap::Parser;

#[derive(Debug, Clone, Parser)]
#[command(about, version)]
pub struct Args {
    #[command(flatten)]
    pub server: ServerArgs,
}

#[derive(clap::Args, Debug, Clone)]
pub struct ServerArgs {
    #[arg(
        long,
        env = "API_HOST",
        name = "API_HOST",
        default_value = "0.0.0.0",
        help = "The host address to bind the server to"
    )]
    pub host: String,

    #[arg(
        long,
        env = "API_PORT",
        name = "API_PORT",
        default_value = "9000",
        help = "The port to bind the server to"
    )]
    pub port: u16,
}
