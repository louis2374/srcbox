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
    body:
    {
        title: string,
        description: string
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { body: { title, description } }, p_user) =>
{
    // I create the upload URL first.
    // Posts should not fail to create, as there
    // will be no unique constraints ect ect
    const file_id = post_create_upload_url();

    // Post to be inserted into db
    const post: Partial<DB_Post> =
    {
        post_title: title,
        post_description: description,
        post_file_id: file_id,
        user_id: p_user
    };

    // Add it to the db
    db_con("tbl_posts").insert(post).returning<[{ post_id: number }]>("post_id")
        .then(([{ post_id }]) =>
        {
            std_response(res, { post_id, file_upload_url: file_id }, Http.CREATED);
        })
        .catch(() =>
        {
            std_response_error(res, "failed to create post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);

            // Remove the upload URL as the post failed
            post_remove_upload_url(file_id);
        });
};

export default docroute()
    .summary("Used to create a new post")
    .parameter("body", "title", "string", true)
    .parameter("body", "description", "string", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();