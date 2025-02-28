import { db_con } from "../connection"
import { DB_User } from "@srcbox/library/src";

export const db_get_user_from_id = async (p_id: number): Promise<DB_User | undefined> =>
{
    const user = await db_con<DB_User>("tbl_users")
        .select("*")
        .where("user_id", p_id)
        .first();

    return user;
}

export const db_user_login = async (p_id: number, p_password: string): Promise<DB_User | undefined> =>
{
    const user = await db_con<DB_User>("tbl_users")
        .select("*")
        .where("user_id", p_id)
        .first();



    return response;
}