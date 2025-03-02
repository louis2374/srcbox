import { DB_Follow, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../../router/route_types";
import { std_response, std_response_error } from "../../../../router/standard_response";
import { route_jwt_authoriser } from "../../../../auth/route_authoriser";
import { db_con } from "../../../../database/connection";
import { param_validator_user } from "../../../../route_validators/user";

interface Params
{
    path:
    {
        user: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { user } }, p_user) =>
{
    const follow: DB_Follow =
    {
        user_id: p_user.user_id,
        user_id_followed: user
    };

    db_con("tbl_follows").where(follow).delete()
        .then(() =>
        {
            std_response(res, {}, Http.OK);
        })
        .catch((e) =>
        {
            std_response_error(res, "failed to unfollow user", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Unfollow a user")
    .parameter("path", "user", "number", true, param_validator_user)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();