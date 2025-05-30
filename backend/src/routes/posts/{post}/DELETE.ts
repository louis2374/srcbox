import { DB_Post, Http, StdAPIErrors } from "@srcbox/library";
import { db_get_user_by_email } from "../../../database/interface/user";
import { docroute } from "../../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../../router/route_types";
import { std_response, std_response_error } from "../../../router/standard_response";
import { password_check } from "../../../auth/password";
import { jwt_create_login_token } from "../../../auth/jwt";
import { route_jwt_authoriser } from "../../../auth/route_authoriser";
import { db_con } from "../../../database/connection";
import { param_validator_post } from "../../../route_validators/post";

interface Params
{
    path:
    {
        post: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post } }, p_user) =>
{
    const post_find: Partial<DB_Post> =
    {
        post_id: post
    }

    db_con("tbl_posts").where(post_find).delete()
        .then(() =>
        {
            std_response(res, {}, Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "encountered an error deleting post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        });
};

export default docroute()
    .summary("Delete a post")
    .parameter("path", "post", "number", true, param_validator_post)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();