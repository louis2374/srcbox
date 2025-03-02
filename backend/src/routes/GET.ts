import { Http } from "@srcbox/library";
import { docroute } from "../router/route_builder";
import { HandlerFunctionAuth } from "../router/route_types";
import { std_response } from "../router/standard_response";
import { route_jwt_authoriser } from "../auth/route_authoriser";

const handler: HandlerFunctionAuth<{}> = async (req, res, { }, user) =>
{
    std_response(res, { user }, Http.OK);
};

export default docroute()
    .summary("Test")
    .authoriser(route_jwt_authoriser)
    .handler(handler)
    .build();