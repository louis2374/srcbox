"use client"
import { api, useToken } from '@/lib/api/api';
import { D_Post, DB_Post, EditableCodeData, Method } from '@srcbox/library';
import React, { useEffect, useState } from 'react'
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { FaCode } from 'react-icons/fa6';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { PiGitFork, PiGitForkBold, PiPlayBold } from 'react-icons/pi';
import PostCardButton from './PostCardButton';
import { readable_i } from '@/lib/util';
import { Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { join } from '@/lib/css';
import PostCardContentPlayer from './PostCardContentPlayer';

interface Props
{
    post: D_Post,
    load_content?: boolean, // If the carad will pull the code and load the iframe,
    id?: string,
    className?: string
}

const PostCard: React.FC<Props> = ({ post, id, className }) =>
{
    const token = useToken();
    const nav = useRouter();
    const [liked, set_liked] = useState(post.liked)
    const [err, set_err] = useState("");

    const [content, set_content] = useState<EditableCodeData>();

    useEffect(() =>
    {
        api("/posts/" + post.post_id + "/code", Method.GET, { token })
            .then(data =>
            {
                if (data.ok)
                {
                    set_content({ ...data.body as EditableCodeData, template: "plain" })
                }
                else set_err(data.body.error || "error")
            })
    }, [])

    const like = (p_like: boolean) =>
    {
        api("/posts/" + post.post_id + "/like", p_like ? Method.POST : Method.DELETE, { token })
            .catch(console.error)
    }

    return (
        <div
            data-id={post.post_id}
            className={join('flex flex-col w-full rounded-lg', className)}
            id={id}>
            <h2 className='pb-3 text-2xl'>
                {post?.post_title}
                {err}
            </h2>

            <div className='w-full h-full bg-neutral-900 border-solid border-black border-4 rounded'>
                {content ? <PostCardContentPlayer content={content} /> : "Loading"}
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
                <PostCardButton tooltip='Open in editor' Icon={FaCode} icon_size_override={23} onClick={() => nav.push("/editor/" + post.post_id)}></PostCardButton>
                <PostCardButton tooltip='Run' Icon={PiPlayBold}>{readable_i(12)}</PostCardButton>
            </div>
        </div>
    )
}

export default PostCard;
