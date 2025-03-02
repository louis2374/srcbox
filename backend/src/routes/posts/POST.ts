import { Http, StdAPIErrors } from "@srcbox/library";
import { db_get_user_by_email } from "../../database/interface/user";
import { docroute } from "../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../router/route_types";
import { std_response, std_response_error } from "../../router/standard_response";
import { password_check } from "../../auth/password";
import { jwt_create_login_token } from "../../auth/jwt";
import { route_jwt_authoriser } from "../../auth/route_authoriser";
import { db_con } from "../../database/connection";

interface Params
{
    body:
    {
        title: string,
        description: string
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { body: { title, description } }, user) =>
{
    const post =
    {
        post_title: title,
        post_description: description
    }

    db_con("tbl_posts").insert(post).returning<[{ post_id: number }]>("post_id").then(id =>
    {
        //  db_con("tbl_posts").update("post_file_id").
    })
};

export default docroute()
    .summary("Used to create a new post")
    .parameter("body", "title", "string", true)
    .parameter("body", "description", "string", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();