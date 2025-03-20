"use client"
import { api, useToken } from '@/lib/api/api';
import { D_Post, DB_Post, Method } from '@srcbox/library';
import React, { useState } from 'react'
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { FaCode } from 'react-icons/fa6';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { PiGitFork, PiGitForkBold, PiPlayBold } from 'react-icons/pi';
import PostCardButton from './PostCardButton';
import { readable_i } from '@/lib/util';
import { Tooltip } from '@mui/material';

interface Props
{
    post: D_Post
}

const PostCard: React.FC<Props> = ({ post }) =>
{
    const token = useToken();
    const [liked, set_liked] = useState(post.liked)

    const like = (p_like: boolean) =>
    {
        api("/posts/" + post.post_id + "/like", p_like ? Method.POST : Method.DELETE, { token })
            .catch(console.error)
    }

    return (
        <div className='flex flex-col w-full hover:bg-backgrounddarker p-4 rounded-lg'>
            <div className='pt-1'>
                {post?.post_title}
            </div>
            <div className='w-full h-96 bg-neutral-700'>
            </div>
            <div className='flex flex-row justify-between gap-2 mt-2 mx-6'>
                <PostCardButton
                    tooltip='Like'
                    selected={liked}
                    IconSelected={BiSolidLike}
                    Icon={BiLike}
                    onClick={() => 
                    {
                        set_liked(!liked);
                        like(!liked);
                    }}
                >
                    {readable_i(post.like_count - (Number(post.liked) - Number(liked)))}
                </PostCardButton>
                <PostCardButton tooltip='Comment' Icon={BiComment}>{post.comment_count}</PostCardButton>
                <PostCardButton tooltip='Fork' Icon={PiGitForkBold}>{post.comment_count}</PostCardButton>
                <PostCardButton tooltip='Open in editor' Icon={FaCode} icon_size_override={23}></PostCardButton>
                <Tooltip title="Plays">
                    <span className='flex flex-row justify-center items-center gap-1 px-1'>
                        <PiPlayBold size={20} />
                        {readable_i(12)}
                    </span>
                </Tooltip>
            </div>
        </div>
    )
}

export default PostCard;
