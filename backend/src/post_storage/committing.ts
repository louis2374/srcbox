import { DB_Post } from "@srcbox/library";
import { post_create_file_id, post_create_upload_url } from "./storage";
import { db_con } from "../database/connection";
import { std_response, std_response_error } from "../router/standard_response";

// Uploads the base data for a post, and generates a link to upload the code
export const pre_upload_post = async (p_title: string, p_desc: string, p_user_id: number): Promise<{ upload_url: string, post_id: number }> =>
{
    // Post to be inserted into db
    const post: Partial<DB_Post> =
    {
        post_title: p_title,
        post_description: p_desc,
        post_file_id: post_create_file_id(),
        user_id: p_user_id,
        post_editable: true
    };

    try
    {
        const uploaded = await db_con("tbl_posts").insert(post).returning<[{ post_id: number }]>("post_id");

        // I high highly doubt this is even possible, but I check it just in case
        if (!uploaded[0].post_id) throw new Error("Fatal: upload did not fail, however no post id was returned");

        // Set the id
        post.post_id = uploaded[0].post_id;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to pre-upload post");
    }

    try
    {
        // Create the signed upload url
        const upload_url = await post_create_upload_url(post.post_file_id!) // I know it exists as i create it earlier with certainty, ! is fine here

        // Success
        return { upload_url, post_id: post.post_id }
    }
    catch (e)
    {
        // If this failed, remove the post from db
        console.error(e)

        // Delete if this fails then the calling function will catch it. I want to avoid nested try/catch
        await db_con("tbl_posts").delete().where({ post_id: post.post_id });

        throw new Error("Failed to generate upload url")
    }
}