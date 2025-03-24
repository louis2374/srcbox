import { D_Post, DB_Post, Http, StdAPIErrors } from "@srcbox/library";
import { db_get_user_by_email } from "../../../database/interface/user";
import { docroute } from "../../../router/route_builder";
import { HandlerFunction, HandlerFunctionAuth } from "../../../router/route_types";
import { std_response, std_response_error } from "../../../router/standard_response";
import { password_check } from "../../../auth/password";
import { jwt_create_login_token } from "../../../auth/jwt";
import { route_jwt_authoriser } from "../../../auth/route_authoriser";
import { db_con } from "../../../database/connection";
import { post_create_upload_url, post_remove_upload_url } from "../../../post_storage/storage";
import { param_validator_post } from "../../../route_validators/post";

interface Params
{
    path:
    {
        post: number,
    }
}



const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { post } }, p_user) =>
{
    // Pretty big query, basically just grabs a bunch of data and joins it all together
    // Its done in order, and will need to be updated as i modify the posts table (Which I will in the future)
    db_con("tbl_posts as posts")
        .select(
            "posts.*",
            // Need to use whereRaw, as the usual .where() does not allow string as second param
            db_con("tbl_users as users").select("users.user_name").whereRaw("users.user_id = posts.user_id").as("user_name").first(),

            // Count number of likes and comments
            db_con("tbl_comments as comments").count("*").where("comments.post_id", post).as("comment_count"),
            db_con("tbl_likes as likes").count("*").where("likes.post_id", post).as("like_count"),

            // I add an extra value here, to state whether the caller of this request has liked the post, for ui purposes
            db_con("tbl_likes as likes").count("*").where("likes.post_id", post).andWhere("likes.user_id", p_user.user_id).as("liked"))
        .first<D_Post>()
        .then((dpost) =>
        {
            std_response(res, { ...dpost, liked: dpost.liked ? true : false }, Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "Failed to retrieve post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
        })
};

export default docroute()
    .summary("Get an existing post via id")
    .parameter("path", "post", "number", true, param_validator_post)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();