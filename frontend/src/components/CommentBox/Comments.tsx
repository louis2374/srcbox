"use client"
import { api, useToken } from '@/lib/api/api'
import { D_Comment, DB_Comment, Method } from '@srcbox/library';
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import FormInput from '../FormInput';
import SButton from '../SButton';
import CommentBox from './CommentBox';
import { IoMdSend } from 'react-icons/io';

interface Props
{
    post_id: number,
}

const Comments: React.FC<Props> = ({ post_id }) =>
{
    const token = useToken();
    const comments = useRef<Array<D_Comment>>([]);
    const [comment, set_comment] = useState("");
    const [loading, set_loading] = useState(true);

    const post_comment = (e: MouseEvent) =>
    {
        e.preventDefault();
        set_loading(true);

        // Send the req to api
        // On success, add the comment to the local array (instead of full reload of all comments)
        api("/posts/" + post_id + "/comments", Method.POST, { token, body: { text: comment } })
            .then((response) =>
            {
                if (response.ok)
                {
                    comments.current = [response.body as D_Comment, ...comments.current];
                }
                else
                {
                    console.error(response.body.error)
                }
            })
            .catch(console.error)
            .finally(() =>
            {
                set_loading(false);
                set_comment("");
            })
    }

    useEffect(() =>
    {
        set_loading(true);

        // Loads all comments, and adds them to the local array
        api("/posts/" + post_id + "/comments", Method.GET, { token })
            .then((response) =>
            {
                if (response.ok)
                {
                    // Reversed until I have proper backend alg
                    comments.current = (response.body as Array<D_Comment>).reverse()
                }
            })
            .catch(console.error)
            .finally(() => set_loading(false))
    }, [])

    return (
        <div className='flex flex-col flex-[0.7] max-w-[500px] gap-6 items-start min-w'>
            <span className='text-xl'>Comments</span>
            <form className='flex flex-row gap-4 w-full'>
                <FormInput value={comment} disabled={loading} container_ClassName='flex-1' className='overflow-hidden' placeholder='Howd you center the div?' update={(e) => set_comment(e.target.value)} />
                <SButton disabled={comment.length == 0} type='submit' onClick={post_comment}><IoMdSend size={30} /></SButton>
                <input type="submit" className='hidden' />
            </form>
            <div className='flex flex-col gap-4'>
                {
                    comments.current.map(c => <CommentBox key={c.comment_id} comment={c} />)
                }
            </div>
        </div>
    )
}

export default Comments;
