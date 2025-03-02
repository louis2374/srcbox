import { Request } from "express";
import { EndpointAuthorizer } from "../router/route_types";
import { jwt_verify_login_token } from "./jwt";

export const route_jwt_authoriser: EndpointAuthorizer = async (p_req: Record<string, unknown>): Promise<number | undefined> =>
{
    // Check token exists
    const raw_token = p_req.authorization as string;

    // No auth provided
    if (!raw_token) return undefined;

    // Remove bearer
    const token = raw_token.replace("Bearer ", "");

    // Check it is valid, and return it
    return jwt_verify_login_token(token);
}