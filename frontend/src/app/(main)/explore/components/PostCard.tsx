import { DB_Post } from '@srcbox/library';
import React from 'react'

interface Props
{
    post: DB_Post
}

const PostCard: React.FC<Props> = ({ post }) =>
{

    return (
        <div className='flex flex-col w-full hover:bg-backgrounddarker p-4 rounded-lg'>
            <div className='w-full h-96 bg-neutral-700'>
            </div>
            <div className='flex flex-row justify-between gap-2 mt-2'>
                <div className='pt-1'>
                    {post.post_title}
                </div>
                <button className='p-2 bg-accent w-32 ml-auto'>Like</button>
                <button className='p-2 bg-accent w-32'>Comment</button>
            </div>
        </div>
    )
}

export default PostCard;
