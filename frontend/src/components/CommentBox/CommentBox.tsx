import { D_Comment } from '@srcbox/library'
import React from 'react'

interface Props
{
    comment: D_Comment
}

const CommentBox: React.FC<Props> = ({ comment }) =>
{
    return (
        <div className='w-full flex flex-row gap-2 items-start'>
            <img className='w-11 rounded-[50%]' src={comment.user_pfp}></img>
            <div className='flex flex-col'>
                <span className='text-neutral-400 text-sm'>{comment.user_name}</span>
                <span>{comment.comment_text}</span>
            </div>
        </div>
    )
}

export default CommentBox;
