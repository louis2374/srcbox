import { DB_User, Http, StdAPIErrors } from "@srcbox/library";
import { db_con } from "../../../database/connection";
import { db_get_user_by_email } from "../../../database/interface/user";
import { docroute } from "../../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../../router/route_types";
import { std_response, std_response_error } from "../../../router/standard_response";
import { password_check } from "../../../auth/password";
import { jwt_create_login_token } from "../../../auth/jwt";
import { route_jwt_authoriser } from "../../../auth/route_authoriser";



const handler: HandlerFunctionAuth<{}> = async (req, res, { }, p_user) =>
{
    const update: Partial<DB_User> =
    {
        user_version: p_user.user_version + 1
    }

    // Increase user version, which invalidates tokens
    db_con("tbl_users").update(update)
        .then(() =>
        {
            std_response(res, {}, Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "failed to invalidate tokens", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Used to invalidate all tokens for a user")
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();