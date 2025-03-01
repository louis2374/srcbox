import { Pool } from "pg";
import knex from "knex"

// Loads knex and connects db
const knex_config = {
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
};

export const db_con = knex(knex_config);