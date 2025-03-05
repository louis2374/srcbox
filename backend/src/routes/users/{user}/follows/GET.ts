import { DB_Like, Http, StdAPIErrors } from "@srcbox/library";
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
    db_con("tbl_follows").where({ user_id: user }).count<[{ count: number }]>("*")
        .then(([{ count }]) =>
        {
            std_response(res, { follows: count }, Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "failed to count follows", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        })
};

export default docroute()
    .summary("Get the number of follows a user has")
    .parameter("path", "user", "number", true, param_validator_user)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();