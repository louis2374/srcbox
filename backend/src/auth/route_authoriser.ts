import { Request } from "express";
import { EndpointAuthorizer } from "../router/route_types";
import { jwt_verify_login_token } from "./jwt";
import { db_get_user_by_id } from "../database/interface/user";
import { DB_User } from "@srcbox/library";

export const route_jwt_authoriser: EndpointAuthorizer<DB_User> = async (p_req: Record<string, unknown>): Promise<DB_User | undefined> =>
{
    // Check token exists
    const raw_token = p_req.authorization as string;

    // No auth provided
    if (!raw_token || !raw_token.startsWith("Bearer ")) return undefined;

    // Remove bearer
    const token = raw_token.replace("Bearer ", "");

    // Check it is valid, and return it
    const is_valid_token = jwt_verify_login_token(token);

    // Invalid
    if (!is_valid_token) return;

    // Check user exists
    const user = await db_get_user_by_id(is_valid_token.user_id);

    // Invalid user id
    if (!user) return;

    // Check version, for jwt invalidation, must match
    if (user.user_version === is_valid_token.version) return user;

    // Invalid version
    return;
}