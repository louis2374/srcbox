import { DB_Like, Http, StdAPIErrors } from "@srcbox/library";
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
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post } }, p_user) =>
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

    const like: DB_Like =
    {
        user_id: p_user,
        post_id: post
    };

    db_con("tbl_likes").where(like).delete()
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
    .summary("Remove a like from a post")
    .parameter("path", "post", "number", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();