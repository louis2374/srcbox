import { Pool } from "pg";

const connection_pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    max: 20,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 3000,
});

connection_pool.on("error", (err) =>
{
    console.error("Database connection interrupted", err);
    process.exit(1);
});

export const db_query = (p_query: string, p_params?: Array<boolean | string | number>) => connection_pool.query(p_query, p_params);