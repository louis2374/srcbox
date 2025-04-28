import { DB_Post } from "@srcbox/library";
import { db_con } from "../connection";
import Fuse from "fuse.js"

// Get a post object via its id
export const post_get_by_id = async (p_id: number): Promise<DB_Post | undefined> =>
{
    try
    {
        // Get the first instance of a post
        const post = await db_con("tbl_posts").where({ post_id: p_id }).select("*").first<DB_Post | undefined>();

        return post;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve post");
    }
}

export const post_get_all_names = async (): Promise<Array<DB_Post>> =>
{
    db_con("tbl_posts").select(["post_title", "post_id"]).then(out =>
    {
        const config = {
            keys: ["post_title"]
        }

        const fuse = new Fuse(out, config);

        console.log(fuse.search("blue"));

        console.log(out);
    }
    )


    return [];
}