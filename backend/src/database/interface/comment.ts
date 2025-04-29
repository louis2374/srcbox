import { DB_Comment } from "@srcbox/library";
import { db_con } from "../connection";

// Get a comment via its id
export const comment_get_by_id = async (p_id: number): Promise<DB_Comment | undefined> =>
{
    try
    {
        // Get the first instance of a comment
        const comment = await db_con("tbl_comments").where({ comment_id: p_id }).select("*").first<DB_Comment | undefined>();

        return comment;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve comment");
    }
}