import { D_Post, DB_Post, Http, StdAPIErrors } from "@srcbox/library";
import { db_get_user_by_email } from "../../database/interface/user";
import { docroute } from "../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../router/route_types";
import { std_response, std_response_error } from "../../router/standard_response";
import { password_check } from "../../auth/password";
import { jwt_create_login_token } from "../../auth/jwt";
import { route_jwt_authoriser } from "../../auth/route_authoriser";
import { db_con } from "../../database/connection";
import { post_create_upload_url } from "../../post_storage/storage";
import { param_validator_max_count } from "../../route_validators/generic";
import { MAX_RETURN_COUNT } from "../../consts";

interface Params
{
    url:
    {
        offset?: number,
        limit?: number
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { url: { offset, limit } }, p_user) =>
{
    // Add it to the db
    // Pretty big query, basically just grabs a bunch of data and joins it all together
    // Its done in order, and will need to be updated as i modify the posts table (Which I will in the future)
    // Pretty big query, basically just grabs a bunch of data and joins it all together
    // Its done in order, and will need to be updated as i modify the posts table (Which I will in the future)
    db_con("tbl_posts")
        .select(
            "tbl_posts.*",
            // Need to use whereRaw, as the usual .where() does not allow string as second param
            db_con("tbl_users").select("tbl_users.user_name").whereRaw("tbl_users.user_id = tbl_posts.user_id").as("user_name").first(),
            db_con("tbl_comments").count("*").whereRaw("tbl_comments.post_id = tbl_posts.post_id").as("comment_count"),
            db_con("tbl_likes").count("*").whereRaw("tbl_likes.post_id = tbl_posts.post_id").as("like_count"),
            db_con("tbl_likes").whereRaw("tbl_likes.post_id = tbl_posts.post_id AND tbl_likes.user_id = ?", [p_user.user_id]).select(db_con.raw("1")).limit(1).as("liked"),
        )
        .limit(limit || MAX_RETURN_COUNT)
        .offset(offset || 0)
        .then((posts) =>
        {
            std_response(res, posts.map(post => (
                {
                    ...post,
                    liked: Number(post.liked) ? true : false,
                    comment_count: Number(post.comment_count),
                    like_count: Number(post.like_count)
                })), Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "Failed to retrieve posts", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
        });
};

export default docroute()
    .summary("Get all posts (debug)")
    .handler(handler)
    .parameter("url", "limit", "number", false, param_validator_max_count)
    .parameter("url", "offset", "number", false)
    .authoriser(route_jwt_authoriser)
    .build();