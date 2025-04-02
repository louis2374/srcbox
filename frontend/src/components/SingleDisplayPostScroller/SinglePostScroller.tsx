"use client"
import { api, useToken } from '@/lib/api/api';
import { D_Post, Method } from '@srcbox/library';
import React, { useEffect, useState } from 'react'
import PostCard from '../PostCard/PostCard';

const SinglePostScroller = () =>
{
    const [post, set_post] = useState<D_Post>();
    const [id, set_id] = useState(1)
    const token = useToken();

    useEffect(() =>
    {
        const l = () =>
        {
            set_id(i => i + 1);
            set_post(undefined);
        }

        window.addEventListener("wheel", l);



        //  return () => window.removeEventListener("wheel", l);
    }, [])

    useEffect(() =>
    {
        console.log({ id })
        api("/posts/" + id, Method.GET, { token }).then(p =>
        {
            if (p.ok) set_post(p.body as D_Post);
            else console.error(p.body.error)
        })
    }, [id])

    if (!post) return "Loading";

    return (
        <div>
            <PostCard post={post} key={post?.post_id} />
        </div>
    )
}

export default SinglePostScroller;
