import { DB_Post, Http, StdAPIErrors } from "@srcbox/library";
import { db_get_user_by_email } from "../../database/interface/user";
import { docroute } from "../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../router/route_types";
import { std_response, std_response_error } from "../../router/standard_response";
import { password_check } from "../../auth/password";
import { jwt_create_login_token } from "../../auth/jwt";
import { route_jwt_authoriser } from "../../auth/route_authoriser";
import { db_con } from "../../database/connection";
import { post_create_upload_url, post_remove_upload_url } from "../../post_storage/storage";

interface Params
{
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { }, p_user) =>
{
    // Add it to the db
    db_con("tbl_posts").select<Array<DB_Post>>("*").then((posts) =>
    {
        std_response(res, posts, Http.OK);
    })
        .catch(() =>
        {
            std_response_error(res, "Failed to retrieve posts", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Get all posts (debug)")
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();