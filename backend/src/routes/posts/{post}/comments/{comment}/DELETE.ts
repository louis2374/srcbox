import { DB_Comment, DB_Like, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../../router/route_types";
import { std_response, std_response_error } from "../../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../../auth/route_authoriser";
import { db_con } from "../../../../../database/connection";
import { post_exists } from "../../../../../database/interface/post";

interface Params
{
    path:
    {
        post: number,
        comment: number
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post, comment } }, p_user) =>
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

    const delete_comment: Partial<DB_Comment> =
    {
        comment_id: comment
    };

    db_con("tbl_comments").where(delete_comment).delete()
        .then(() =>
        {
            std_response(res, {}, Http.OK);
        })
        .catch((e) =>
        {
            std_response_error(res, e, StdAPIErrors.UNKNOWN, Http.OK);
        })
};

export default docroute()
    .summary("Remove a comment from a post")
    .parameter("path", "post", "number", true)
    .parameter("path", "comment", "number", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();