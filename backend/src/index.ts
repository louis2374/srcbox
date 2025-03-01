// This is first so anything that uses these has access
import { validate_environment } from './environment_validation';
validate_environment();

// Usual imports
import express from 'express';
import cors from 'cors';
import { db_get_user_from_id } from './database/interface/user';
import { parse_routes } from './router/router';

//  Create server
const server = express();

// For dev as its easier, later this should be removed later
server.use(cors());

server.listen(process.env.PORT || 4000, () =>
{
    console.log("Listening on port", process.env.PORT || 4000);
});

parse_routes(server);