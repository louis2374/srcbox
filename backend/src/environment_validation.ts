const required_env_vars =
    [
        "DATABASE_USER",
        "DATABASE_PASSWORD",
        "DATABASE_HOST",
        "DATABASE_PORT",
        "DATABASE_NAME"
    ];

export const validate_environment = () =>
{
    required_env_vars.forEach(env_name =>
    {
        if (process.env[env_name] !== undefined) return;

        // Does not exist
        console.error(`Required environment variable ${env_name} does not exist. Exiting`);
        // Close app
        process.exit(1);
    });
}