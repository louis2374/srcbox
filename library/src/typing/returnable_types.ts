export interface D_User
{
    user_id: number,
    user_name: string,
}

export interface D_Comment
{
    comment_id: number,
    post_id: number,
    comment_text: string,

    // User who posted comment
    user: D_User
}

export interface D_Post
{
    post_id: number,
    user_id: number,
    post_file_id: string,
    post_title: string,
    post_description: string,

    // User who posted
    user_name: string

    // Count
    comment_count: number,
    like_count: number,

    // If the user sending this request has liked the post
    // Not always applicable
    liked: boolean,
}