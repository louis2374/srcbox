"use client"
import { api, useToken } from '@/lib/api/api'
import { D_Comment, DB_Comment, Method } from '@srcbox/library';
import React, { useEffect, useRef, useState } from 'react'
import FormInput from '../FormInput';
import SButton from '../SButton';

interface Props
{
    post_id: number,
}

const CommentBox: React.FC<Props> = ({ post_id }) =>
{

    const token = useToken();

    const comments = useRef<Array<DB_Comment>>([]);

    const [comment, set_comment] = useState("");

    const [loading, set_loading] = useState(true);

    const post_comment = (p_text: string) =>
    {
        set_loading(true);
        api("/posts/" + post_id + "/comments", Method.POST, { token, body: { text: p_text } })
            .then((response) =>
            {
                if (response.ok)
                {
                    comments.current = [response.body as DB_Comment, ...comments.current]
                    console.log(response.body)
                }
                else
                {
                    console.error(response.body.error)
                }
            })
            .catch(console.error)
            .finally(() => set_loading(false))
    }

    useEffect(() =>
    {
        set_loading(true);
        api("/posts/" + post_id + "/comments", Method.GET, { token })
            .then((response) =>
            {
                if (response.ok)
                {
                    comments.current = response.body as Array<DB_Comment>
                }
            })
            .catch(console.error)
            .finally(() => set_loading(false))
    }, [])

    return (
        <div className='h-'>
            <FormInput update={(e) => set_comment(e.target.value)} />
            <SButton onClick={() => post_comment(comment)}>Comment</SButton>
            {
                comments.current.map(c =>
                    <p className='border-pink-600 border-solid border-2' key={c.comment_id}>{c.comment_text}</p>)
            }
        </div>
    )
}

export default CommentBox
