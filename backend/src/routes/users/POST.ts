import { DB_User, Http, PostgresErrorCode, StdAPIErrors } from "@srcbox/library";
import { db_con } from "../../database/connection";
import { docroute } from "../../router/route_builder";
import { std_response, std_response_error } from "../../router/standard_response";
import { HandlerFunction } from "../../router/route_types";
import { CONSTRAINT_USERS_EMAIL, CONSTRAINT_USERS_USERNAME } from "../../database/info";
import { password_hash } from "../../auth/password";

interface Params
{
    body:
    {
        username: string,
        email: string,
        password: string
    }
}

const handler: HandlerFunction<Params> = async (req, res, { body: { username, email, password } }) =>
{
    // I do hash before checking if the user exists, this saves
    // a database call and simplifies the code, as
    // i dont also need to check for a race condition on top of the extra
    // db calls
    // This could mean I do a hash when the user is never inserted
    // but this will be very rare
    // This does open me up to a form of ddos, if a user spams
    // I will have to constantly hash
    // however I will have rate limiting at a higher level
    // and this will not be a problem right now

    // Hash password for storage
    let hash = "";
    try
    {
        hash = await password_hash(password);
    }
    catch (e)
    {
        std_response_error(res, "encountered an error creating account", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
    }

    // Construct user obj, without id
    const user: Omit<DB_User, "user_id"> =
    {
        user_email: email,
        user_name: username,
        user_password: hash,
        user_verified: false
    }

    // Try to insert the user into the db
    db_con("tbl_users").insert(user).returning<[{ user_id: number }]>("user_id")
        .then((out) =>
        {
            // Success
            // I explictly create a new obj and dont just do {out[0]}, incase it
            // contains data i dont want to send to the user
            std_response(res, { user_id: out[0].user_id }, Http.CREATED);
        })
        .catch((e) =>
        {
            // If this error is from username/email duplicate
            if (e.code == PostgresErrorCode.UNIQUE_CONSTRAINT_VIOLATION)
            {
                // Check which constraint caused the error, if it was a constraint
                if (e.constraint === CONSTRAINT_USERS_USERNAME)
                {
                    std_response_error(res, "username already in use", StdAPIErrors.USERNAME_ALREADY_EXISTS, Http.CONFLICT);
                }
                else if (e.constraint === CONSTRAINT_USERS_EMAIL)
                {
                    std_response_error(res, "email already in use", StdAPIErrors.EMAIL_ALREADY_EXISTS, Http.CONFLICT);
                }
                else
                {
                    std_response_error(res, "encountered an error creating account", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
                }
            }
            else
            {
                std_response_error(res, "encountered an error creating account", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
            }
        })
};

export default docroute()
    .summary("Used to register new users")
    .parameter("body", "username", "string", true)
    .parameter("body", "email", "string", true)
    .parameter("body", "password", "string", true)
    .handler(handler)
    .build();