import { db_con } from "../connection";

// If a post exists
export const post_exists = async (p_id: number): Promise<boolean> =>
{
    // Im not catching the error, any errors should propagate
    const exists = await db_con("tbl_posts").where({ post_id: p_id }).select("*");

    console.log(exists);
    // Convert to bool, length 0 means it does not exist
    return !!exists.length;
}