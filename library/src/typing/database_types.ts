export interface DB_User
{
    user_id: number,
    user_name: string,
    user_email: string,
    user_password: string,
    user_verified: boolean,
    user_version: number
}

export interface DB_Comment
{
    comment_id: number,
    user_id: number,
    post_id: number,
    comment_text: string
}

export interface DB_Post
{
    post_id: number,
    user_id: number,
    post_file_id: string,
    post_title: string,
    post_description: string
}

export interface DB_Follow
{
    user_id: number,
    user_id_followed: number
}

export interface DB_Like
{
    user_id: number,
    post_id: number
}