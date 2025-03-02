import { DB_Comment, DB_Like, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../router/route_types";
import { std_response, std_response_error } from "../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../auth/route_authoriser";
import { db_con } from "../../../../database/connection";
import { post_exists } from "../../../../database/interface/post";

interface Params
{
    path:
    {
        post: number,
    },
    body:
    {
        text: string
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post }, body: { text } }, p_user) =>
{
    // Check if the post exists
    try
    {
        const exists = await post_exists(post);

        if (!exists)
        {
            std_response_error(res, "post does not exist", StdAPIErrors.POST_NOT_FOUND, Http.NOT_FOUND)
            return;
        }
    }
    catch (e)
    {
        std_response_error(res, "failed to retrieve post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
        return;
    }

    const comment: Partial<DB_Comment> =
    {
        user_id: p_user,
        post_id: post,
        comment_text: text
    };

    db_con("tbl_comments").insert(comment).returning<[{ comment_id: number }]>("comment_id")
        .then(([{ comment_id }]) =>
        {
            std_response(res, { comment_id }, Http.OK);
        })
        .catch((e) =>
        {
            std_response_error(res, e, StdAPIErrors.UNKNOWN, Http.OK);
        })
};

export default docroute()
    .summary("Add a comment to a post")
    .parameter("path", "post", "number", true)
    .parameter("body", "text", "string", true, "The text content of the comment")
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();