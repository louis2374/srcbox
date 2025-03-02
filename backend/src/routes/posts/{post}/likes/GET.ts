import { DB_Like, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../router/route_types";
import { std_response, std_response_error } from "../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../auth/route_authoriser";
import { db_con } from "../../../../database/connection";
import { post_exists } from "../../../../database/interface/post";
import { param_validator_post } from "../../../../router/route_validators/post";

interface Params
{
    path:
    {
        post: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post } }, p_user) =>
{
    db_con("tbl_likes").where({ post_id: post }).count<[{ count: number }]>("*")
        .then(([{ count }]) =>
        {
            std_response(res, { likes: count }, Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "failed to count likes", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Get the number of likes a post has")
    .parameter("path", "post", "number", true, param_validator_post)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();