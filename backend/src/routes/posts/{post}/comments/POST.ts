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
    },
    body:
    {
        text: string
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post }, body: { text } }, p_user) =>
{
    const comment: Partial<DB_Comment> =
    {
        user_id: p_user.user_id,
        post_id: post,
        comment_text: text
    };

    try
    {
        // Create the comment, and return the entire inserted row
        const [created] = await db_con("tbl_comments").insert(comment).returning<Array<DB_Comment>>("*")

        if (created.comment_id)
        {
            // Add user detail
            const detailed: D_Comment =
            {
                ...created,
                user_name: p_user.user_name,
                user_pfp: "/pfp.webp"
            }

            // Return this to the user
            std_response(res, detailed, Http.OK);
        }
        else throw new Error("Failed to post comment")
    }
    catch (e)
    {
        std_response_error(res, "failed to add comment", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
    }
};

export default docroute()
    .summary("Add a comment to a post")
    .parameter("path", "post", "number", true, param_validator_post)
    .parameter("body", "text", "string", true, undefined, "The text content of the comment")
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();