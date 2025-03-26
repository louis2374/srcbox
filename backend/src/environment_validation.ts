import dotenv from 'dotenv';

const required_env_vars =
    [
        "DATABASE_USER",
        "DATABASE_PASSWORD",
        "DATABASE_HOST",
        "DATABASE_PORT",
        "DATABASE_NAME",
        "PORT",
        "JSONWEBTOKEN_SECRET",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_REGION"
    ];

const validate_envs = () =>
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

export const validate_environment = () =>
{
    // Only matters in dev (purely loading the .env)
    if (process.env.NODE_ENV !== 'production')
    {
        const loaded_env = dotenv.config();

        // Failed to load env in dev mode
        if (loaded_env.error)
        {
            console.error("Could not load .env file", loaded_env.error);
            process.exit(1);
        }
    };

    // Check all required envs exist
    validate_envs();
}