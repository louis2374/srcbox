// This is first so anything that uses these has access
import { validate_environment } from './environment_validation';
validate_environment();

// Usual imports
import express from 'express';
import cors from 'cors';
import { parse_routes } from './router/router';

const port = process.env.PORT || 4000;

// Create server
const server = express();

// For dev as its easier, later this should be removed
server.use(cors());

// Parse bodies into json
server.use(express.json());

// Load api endpoints
parse_routes(server);

// Start the server
server.listen(port, () =>
{
    console.log("Listening on port", port);
});