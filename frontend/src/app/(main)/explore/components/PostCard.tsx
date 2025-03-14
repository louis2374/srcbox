"use client"
import { DB_Post } from '@srcbox/library';
import React from 'react'

interface Props
{
    post: DB_Post
}

const PostCard: React.FC<Props> = ({ post }) =>
{
    const like = () =>
    {
        fetch("http://localhost:4000/posts/" + post.post_id + "/like", {
            method: "POST",
            headers: { authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjowLCJpYXQiOjE3NDE5NTAwMzgsImV4cCI6MTc0MzE1OTYzOCwiYXVkIjoiY29tLnNyY2JveC5hdXRoIiwiaXNzIjoiY29tLnNyY2JveC5hdXRoIiwic3ViIjoiMSJ9.0yBb2vm4oxQnNT9IbfdsKsOAwoLm_URv4KBRlz0WIdU" }
        })
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
