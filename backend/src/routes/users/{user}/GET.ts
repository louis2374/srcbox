import { DB_Post, DB_User, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../router/route_types";
import { std_response, std_response_error } from "../../../router/standard_response";
import { route_jwt_authoriser } from "../../../auth/route_authoriser";
import { db_con } from "../../../database/connection";
import { param_validator_post } from "../../../route_validators/post";
import { param_validator_user } from "../../../route_validators/user";

interface Params
{
    path:
    {
        user: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { user } }, p_user) =>
{
    const user_find: Partial<DB_Post> =
    {
        user_id: user
    }

    db_con("tbl_users").select("*").where(user_find).first<DB_User | undefined>()
        .then((retrieved_user) =>
        {
            // No user found
            if (!retrieved_user)
            {
                std_response_error(res, "user not found", StdAPIErrors.NOT_FOUND, Http.NOT_FOUND);
                return;
            }

            // I may add more stuff to this later, such as total posts,
            // followers ect ect (not stored in db)
            const safe: Partial<DB_User> =
            {
                user_id: retrieved_user.user_id,
                user_name: retrieved_user.user_name
            }

            // Only send safe data
            std_response(res, safe, Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "encountered an error retrieving user", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        });
};

export default docroute()
    .summary("Get a users info")
    .parameter("path", "user", "number", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();