import express from 'express';
import cors from 'cors';
import { shared } from '@srcbox/library';

// Load .env if development
if (process.env.NODE_ENV !== 'production') (async () => await import('dotenv/config'))();


const server = express();

server.use(cors());

server.get("/", (req, res) =>
{
    res.send(shared() + "Hello testk " + Date.now() + "ENV: " + process.env.TEST);
})
//

server.listen(4000, () =>
{
    console.log("Listening on port 4000");
});