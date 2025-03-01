import { Http, STDAPIErrors } from "@srcbox/library";
import { db_con } from "../../../database/connection";
import { db_get_user_by_email } from "../../../database/interface/user";
import { docroute } from "../../../router/route_builder";
import { HandlerFunction } from "../../../router/route_types";
import { std_response, std_response_error } from "../../../router/standard_response";
import { password_check } from "../../../auth/password";
import { jwt_create_login_token } from "../../../auth/jwt";

interface Params
{
    body:
    {
        email: string,
        password: string
    }
}

const handler: HandlerFunction<Params> = async (req, res, { body: { email, password } }) =>
{
    // Get user
    const user = await db_get_user_by_email(email);

    // Check user exists with this email (emails are unique)
    // and if password matches
    if (!user || !await password_check(user.user_password, password))
    {
        std_response_error(res, "invalid credentials", STDAPIErrors.INVALID_LOGIN_CREDENTIALS, Http.UNAUTHORIZED);
        return;
    }

    // May add more checking in the future

    // Create token that lasts 2 weeks
    const token = jwt_create_login_token(user.user_id, 24 * 14);

    // Send to user
    std_response(res, { token }, Http.CREATED);
};

export default docroute()
    .summary("Used to create a signed login token")
    .parameter("body", "email", "string", true)
    .parameter("body", "password", "string", true)
    .handler(handler)
    .build();