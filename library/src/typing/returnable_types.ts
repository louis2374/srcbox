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

    // Extra
    user: D_User
}

export interface D_Post
{
    post_id: number,
    user_id: number,
    post_file_id: string,
    post_title: string,
    post_description: string,

    // Extra
    user: D_User
}