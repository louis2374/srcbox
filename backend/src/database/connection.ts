import { Pool } from "pg";
import knex, { Knex } from "knex"

// Loads knex and connects db
const knex_config: Knex.Config =
{
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl:
        {
            rejectUnauthorized: false
        }
    },
};

const knex_config_test: Knex.Config =
{
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
};

export const db_con = knex(process.env.DATABASE_LOCAL ? knex_config_test : knex_config);