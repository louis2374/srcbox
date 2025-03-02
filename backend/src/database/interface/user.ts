import { db_con } from "../connection"
import { DB_User } from "@srcbox/library/src";



export const db_get_user_by_id = async (p_id: number): Promise<DB_User | undefined> =>
{
    const user = await db_con<DB_User>("tbl_users")
        .select("*")
        .where("user_id", p_id)
        .first();

    return user;
}

export const db_get_user_by_email = async (p_email: string): Promise<DB_User | undefined> =>
{
    const user = await db_con<DB_User>("tbl_users")
        .select("*")
        .where("user_email", p_email)
        .first();

    return user;
}

export const db_get_user_by_name = async (p_name: string): Promise<DB_User | undefined> =>
{
    const user = await db_con<DB_User>("tbl_users")
        .select("*")
        .where("user_name", p_name)
        .first();

    return user;
}