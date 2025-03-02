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
    db_con("tbl_posts").select("*").where("post_id", post).first<DB_Post | undefined>()
        .then((retrieved_post) =>
        {
            if (retrieved_post) std_response(res, retrieved_post, Http.OK);

            // I put an error here, instead of not found bc this should only happen on the very rare
            // occasion, and I want to know when it does
            else std_response_error(res, "encountered an error retrieving post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
        .catch(() =>
        {
            std_response_error(res, "encountered an error retrieving post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        });
};

export default docroute()
    .summary("Get an existing post via id")
    .parameter("path", "post", "number", true, param_validator_post)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();