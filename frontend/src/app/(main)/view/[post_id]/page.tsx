import CommentBox from '@/components/CommentBox/CommentBox';
import PostCard from '@/components/PostCard/PostCard';
import { api } from '@/lib/api/api';
import { getToken } from '@/lib/api/ssr';
import { D_Post, Method, StdAPIErrors } from '@srcbox/library';
import { permanentRedirect } from 'next/navigation';
import React from 'react'

interface Props
{
    params: Promise<{ post_id?: string }>
}

const page: React.FC<Props> = async ({ params }) =>
{
    const { post_id } = await params;
    console.log({ post_id })
    if (!post_id)
    {
        permanentRedirect("/explore")
    }

    const token = await getToken();
    try
    {
        const response = await api("/posts/" + post_id, Method.GET, { token });
        if (response.ok)
        {
            const post = response.body as D_Post
            return (
                <div className='w-full max-w-3xl'>
                    <PostCard post={post} />
                    <CommentBox post_id={post.post_id} />
                </div>
            )
        }
        else if (response.body.code === StdAPIErrors.NOT_FOUND)
        {
            return (
                <div className='w-full max-w-3xl'>
                    Not Found
                </div>
            )
        }
        else throw response.body.error
    }
    catch (e)
    {
        console.error(e);
        return (<>Encountered an error</>)
    }

}

export default page;
