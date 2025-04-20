"use client"
import { api, useToken } from '@/lib/api/api';
import { D_Post, Method } from '@srcbox/library';
import React, { useEffect, useState } from 'react'
import PostCard from '../PostCard/PostCard';
import PostSplitter from '../PostSplitter';
import { join } from '@/lib/css';

const SinglePostScroller = () =>
{
    const [id, set_id] = useState(0)
    const token = useToken();

    const [loaded_posts, set_loaded_posts] = useState<Array<D_Post>>([]);

    useEffect(() =>
    {
        const l = (k: WheelEvent) =>
        {
            if (k.deltaY > 0)
            {
                set_id(i => i - 1);
            }
            else if (k.deltaY < 0)
            {
                set_id(i => i + 1);
            }
        }

        window.addEventListener("wheel", l);

        return () => window.removeEventListener("wheel", l);
    }, [])

    const load_post = (p_id: number) =>
    {
        api("/posts/" + p_id, Method.GET, { token }).then(post =>
        {
            // Add it to all posts
            if (post.ok) set_loaded_posts(p => [...p, post.body as D_Post])
        })
            .catch()
    }

    useEffect(() =>
    {
        [0, 1, 2, 3, 4].forEach(load_post);
    }, [])

    return (
        <div>
            <div className='flex flex-row gap-4'>{loaded_posts.map(p => (<div key={p.post_id} className={join(p.post_id === id && "text-red-600")}>{p.post_title}</div>))}</div>
            {
                loaded_posts[id] &&
                <PostCard post={loaded_posts[id]} key={loaded_posts[id].post_id} />
            }
        </div>
    )
}

export default SinglePostScroller;
