// Load .env if development
// This is first so anything that uses these has access
import dotenv from 'dotenv';
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
import { validate_environment } from './environment_validation';
// Ensure all vars exist
validate_environment();

import express from 'express';
import cors from 'cors';
import { shared } from '@srcbox/library';
import { db_query } from './database/connection';

/*
const server = express();

// For dev as its easier, later this should be removed later
server.use(cors());

// Testing func for now
server.get("/", async (req, res) =>
{
    const response = await db_query("SELECT 123");
    res.send(response.rows[0]);
})//
//

server.listen(4000, () =>
{
    console.log("Listening on port 4000");
});*/

db_query("SELECT 1").then(console.log).catch(console.log);