import { DB_Post, Http, StdAPIErrors } from "@srcbox/library";
import { db_get_user_by_email } from "../../../database/interface/user";
import { docroute } from "../../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../../router/route_types";
import { std_response, std_response_error } from "../../../router/standard_response";
import { password_check } from "../../../auth/password";
import { jwt_create_login_token } from "../../../auth/jwt";
import { route_jwt_authoriser } from "../../../auth/route_authoriser";
import { db_con } from "../../../database/connection";
import { post_create_upload_url, post_remove_upload_url } from "../../../post_storage/storage";

interface Params
{
    path:
    {
        post: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post } }, p_user) =>
{
    db_con("tbl_posts").select("*").where("post_id", post).first<DB_Post | undefined>()
        .then((retrieved_post) =>
        {
            if (retrieved_post) std_response(res, retrieved_post, Http.OK);
            else std_response_error(res, "post not found", StdAPIErrors.POST_NOT_FOUND, Http.NOT_FOUND);
        })
        .catch(() =>
        {
            std_response_error(res, "encountered an error retrieving post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        });
};

export default docroute()
    .summary("Get an existing post via id")
    .parameter("path", "post", "number", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();