import { DB_Like, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../router/route_types";
import { std_response, std_response_error } from "../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../auth/route_authoriser";
import { db_con } from "../../../../database/connection";
import { post_exists } from "../../../../database/interface/post";
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
    const like: DB_Like =
    {
        user_id: p_user.user_id,
        post_id: post
    };

    db_con("tbl_likes").insert(like).onConflict().ignore()
        .then(() =>
        {
            std_response(res, {}, Http.OK);
        })
        .catch((e) =>
        {
            std_response_error(res, "failed to like post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Add a like to a post")
    .parameter("path", "post", "number", true, param_validator_post)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();