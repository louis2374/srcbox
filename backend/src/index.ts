import express from 'express';
import cors from 'cors';

const server = express();

server.use(cors());

server.get("/", (req, res) =>
{
    res.send("Hello " + Date.now());
})

server.listen(4000, () =>
{
    console.log("Listening on port 4000");
});