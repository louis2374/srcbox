import { Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../router/route_types";
import { std_response, std_response_error } from "../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../auth/route_authoriser";
import { param_validator_post } from "../../../../route_validators/post";
import { s3 } from "../../../../post_storage/s3";
import { post_get_code } from "../../../../post_storage/storage";
import { post_get_by_id } from "../../../../database/interface/post";

interface Params
{
    path:
    {
        post: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post } }, p_user) =>
{

    const full_post = await post_get_by_id(post);

    // No data on this post
    if (!full_post?.post_file_id)
    {
        std_response_error(res, "Not found", StdAPIErrors.NOT_FOUND, Http.NOT_FOUND);
        return;
    }

    // Not an editable post
    if (!full_post.post_editable)
    {
        std_response_error(res, "Not editable", StdAPIErrors.POST_NOT_EDITABLE, Http.NOT_FOUND);
        return;
    }

    try
    {
        const content = await post_get_code(full_post.post_file_id)
        if (!content)
        {
            std_response_error(res, "Not found", StdAPIErrors.POST_NO_CODE, Http.NO_CONTENT);
        }
        else std_response(res, JSON.parse(content), Http.OK);
    }
    catch (e)
    {
        console.log()
        console.error(e);
        std_response_error(res, "Failed to retrieve post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
    }
};

export default docroute()
    .summary("Get the code content for a post by id")
    .parameter("path", "post", "number", true, param_validator_post)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();