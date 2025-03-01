import { DB_User } from "@srcbox/library";
import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken"

const secret = process.env.JSONWEBTOKEN_SECRET || "12345";
const JWT_AUDIENCE = "com.srcbox.auth";

// Creates a login token, signed with sub as user id
export const jwt_create_login_token = (p_user_id: number, p_expires_in_h: number) =>
{
    const options: jwt.SignOptions =
    {
        // Convert hours to seconds
        expiresIn: p_expires_in_h * 60 * 60,
        audience: JWT_AUDIENCE,
        subject: p_user_id.toString(),
        issuer: JWT_AUDIENCE,
    }

    // I may add extra stuff to the body, such as user agent, ip, platform
    // these could help with security a little
    const token = jwt.sign({}, secret, options);

    return token;
}

// Returns the user id if the token is valid, undefined otherwise
export const jwt_verify_login_token = (p_token: string): number | undefined =>
{
    // Checks these match
    const options: VerifyOptions =
    {
        audience: JWT_AUDIENCE,
        issuer: JWT_AUDIENCE
    }

    // Verify the tokens signature, extract user id and return it as a number
    try
    {
        const token = jwt.verify(p_token, secret, options) as JwtPayload;
        if (token.sub) return Number(token.sub) || undefined;
        else return undefined;
    }
    catch (e)
    {
        return undefined;
    }
}