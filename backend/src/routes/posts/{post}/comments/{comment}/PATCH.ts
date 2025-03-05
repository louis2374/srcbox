import { DB_Comment, DB_Like, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../../router/route_types";
import { std_response, std_response_error } from "../../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../../auth/route_authoriser";
import { db_con } from "../../../../../database/connection";
import { param_validator_post } from "../../../../../route_validators/post";
import { param_validator_comment } from "../../../../../route_validators/comment";

interface Params
{
    path:
    {
        post: number,
        comment: number
    },
    body:
    {
        text: string
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post, comment }, body: { text } }, p_user) =>
{
    // Objects to find / update the comment
    const find_comment: Partial<DB_Comment> =
    {
        comment_id: comment
    }

    const update_comment: Partial<DB_Comment> =
    {
        comment_text: text
    };

    // Update
    db_con("tbl_comments").where(find_comment).update(update_comment)
        .then(() =>
        {
            std_response(res, {}, Http.OK);
        })
        .catch((e) =>
        {
            std_response_error(res, "failed to update comment", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Edit a comment")
    .parameter("path", "post", "number", true, param_validator_post)
    .parameter("path", "comment", "number", true, param_validator_comment)
    .parameter("body", "text", "string", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();