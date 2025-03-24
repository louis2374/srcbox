import { D_Comment, DB_Comment, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../router/route_types";
import { std_response, std_response_error } from "../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../auth/route_authoriser";
import { db_con } from "../../../../database/connection";
import { } from "../../../../database/interface/post";
import { param_validator_post } from "../../../../route_validators/post";

interface Params
{
    path:
    {
        post: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post } }, p_user) =>
{
    console.log(post)
    db_con("tbl_comments as comments")
        .select<Array<D_Comment>>(
            "comments.*",
            // Need to use whereRaw, as the usual .where() does not allow string as second param
            db_con("tbl_users as users").select("users.user_name").whereRaw("users.user_id = comments.user_id").as("user_name")
        )
        .where("post_id", post)
        .then((comments) =>
        {
            // Adding temp pfp for now

            std_response(res, comments.map(c => ({ ...c, user_pfp: "/pfp.webp" })), Http.OK);
        })
        .catch((e) =>
        {
            std_response_error(res, "failed to get comments", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Get all comments (DEV)")
    .handler(handler)
    .parameter("path", "post", "number", true, param_validator_post)
    .authoriser(route_jwt_authoriser)
    .build();