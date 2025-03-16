"use client"
import { api, useToken } from '@/lib/api/api';
import { D_Post, DB_Post, Method } from '@srcbox/library';
import React from 'react'

interface Props
{
    post: D_Post
}

const PostCard: React.FC<Props> = ({ post }) =>
{
    const token = useToken();

    console.log(post)
    const like = () =>
    {
        api("/posts/" + post.post_id + "/like", Method.POST, { token }).then(console.log)
    }

    return (
        <div className='flex flex-col w-full hover:bg-backgrounddarker p-4 rounded-lg'>
            <div className='w-full h-96 bg-neutral-700'>
            </div>
            <div className='flex flex-row justify-between gap-2 mt-2'>
                <div className='pt-1'>
                    {post?.post_title}
                </div>
                <button className='p-2 bg-accent w-32 ml-auto' onClick={like}>Like</button>
                <button className='p-2 bg-accent w-32'>Comment</button>
            </div>
        </div>
    )
}

export default PostCard;
