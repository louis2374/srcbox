import { DB_Post, DB_User, Http, StdAPIErrors } from "@srcbox/library";
import { docroute } from "../../../router/route_builder";
import { HandlerFunctionAuth } from "../../../router/route_types";
import { std_response, std_response_error } from "../../../router/standard_response";
import { route_jwt_authoriser } from "../../../auth/route_authoriser";
import { db_con } from "../../../database/connection";
import { param_validator_post } from "../../../route_validators/post";
import { param_validator_user } from "../../../route_validators/user";

interface Params
{
    path:
    {
        user: number,
    }
}

const handler: HandlerFunctionAuth<Params> = async (req, res, { path: { user } }, p_user) =>
{
    const user_find: Partial<DB_Post> =
    {
        user_id: user
    }

    db_con("tbl_users")
        .select("tbl_users.*",
            db_con("tbl_follows")
                .count("*")
                .whereRaw("tbl_follows.user_id = tbl_users.user_id")
                .as("following"),
            db_con("tbl_follows")
                .count("*")
                .whereRaw("tbl_follows.user_id_followed = tbl_users.user_id")
                .as("followers"),
            db_con("tbl_follows").where("user_id_followed", user).andWhere("user_id", p_user.user_id).select(db_con.raw("1")).limit(1).as("followed"))
        .where(user_find)
        .first<DB_User & { following: number; followers: number, followed: "1" | "0" } | undefined>()



        .then((retrieved_user) =>
        {
            // No user found
            if (!retrieved_user)
            {
                std_response_error(res, "user not found", StdAPIErrors.NOT_FOUND, Http.NOT_FOUND);
                return;
            }

            // I may add more stuff to this later, such as total posts,
            // followers ect ect (not stored in db)
            const safe =
            {
                user_id: retrieved_user.user_id,
                user_name: retrieved_user.user_name,
                user_bio: retrieved_user.user_bio || "",
                following: retrieved_user.following,
                followers: retrieved_user.followers,
                followed: retrieved_user.followed
            }

            // Only send safe data
            std_response(res, safe, Http.OK);
        })
        .catch(() =>
        {
            std_response_error(res, "encountered an error retrieving user", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR);
        });
};

export default docroute()
    .summary("Get a users info")
    .parameter("path", "user", "number", true)
    .handler(handler)
    .authoriser(route_jwt_authoriser)
    .build();