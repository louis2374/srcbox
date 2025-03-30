import { DB_Post, Http, StdAPIErrors } from "@srcbox/library";
import { db_get_user_by_email } from "../../database/interface/user";
import { docroute } from "../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../router/route_types";
import { std_response, std_response_error } from "../../router/standard_response";
import { password_check } from "../../auth/password";
import { jwt_create_login_token } from "../../auth/jwt";
import { route_jwt_authoriser } from "../../auth/route_authoriser";
import { db_con } from "../../database/connection";
import { post_create_file_id, post_create_upload_url } from "../../post_storage/storage";
import { pre_upload_post } from "../../post_storage/committing";

interface Params
{
    body:
    {
        title: string,
        description: string
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { body: { title, description } }, p_user) =>
{
    pre_upload_post(title, description, p_user.user_id)
        .then((data) =>
        {
            std_response(res, data, Http.CREATED);
        })
        .catch(() =>
        {
            std_response_error(res, "Failed to pre-upload post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
        })
};

export default docroute()
    .summary("Used to create a new post")
    .parameter("body", "title", "string", true)
    .parameter("body", "description", "string", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();