import { db_con } from "../connection";

// If a comment exists
export const comment_exists = async (p_id: number): Promise<boolean> =>
{
    // Im not catching the error, any errors should propagate
    const exists = await db_con("tbl_comments").where({ comment_id: p_id }).select("*");

    console.log(exists);
    // Convert to bool, length 0 means it does not exist
    return !!exists.length;
}