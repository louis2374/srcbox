"use client"
import { api, useToken } from '@/lib/api/api';
import { D_Post, DB_Post, Method } from '@srcbox/library';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import PostCard from '../PostCard/PostCard';
import PostSplitter from '../PostSplitter';
import { join } from '@/lib/css';
import { debounce } from '@/lib/util';
import { useRouter } from 'next/navigation';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface Props
{
    top?: number // The top/starting post, if undefined will be random
}

const SinglePostScroller: React.FC<Props> = () =>
{
    const history = useRouter();
    const token = useToken();
    const scroll_container = useRef<HTMLDivElement>(null);
    const [loaded_posts, set_loaded_posts] = useState<Map<number, D_Post>>(new Map());
    const observer = useRef<IntersectionObserver>(null);

    useEffect(() =>
    {
        observer.current = build_observer();

        const scrolled = () =>
        {

        }

        window.addEventListener("wheel", scrolled);

        return () => observer.current?.disconnect();
    }, []);

    useEffect(() =>
    {
        if (!observer.current || !scroll_container.current) return;


        // Empty it
        observer.current.disconnect();

        // Add all posts
        Array.from(scroll_container.current.children).forEach(observer.current.observe.bind(observer.current));
    }, [loaded_posts])

    const build_observer = () =>
    {
        return new IntersectionObserver((entries) =>
        {
            // For each observed element
            entries.forEach(entry =>
            {
                // If it is visible
                if (entry.isIntersecting)
                {
                    // Set the url to this id
                    set_post_in_url(Number(entry.target.getAttribute("data-id")));
                }
            })

            // I use threshold 1, so it must be 100% visible to trigger
        }, { root: scroll_container.current, threshold: 1 })
    }

    const set_post_in_url = (p_id: number | undefined) =>
    {
        // If no id, (0 would count as none, so i add exception) it removes the /
        const url = !p_id && p_id !== 0 ? "/explore" : "/explore/" + p_id;
        window.history.replaceState(null, '', url);
    }

    const load_post = (p_id: number) =>
    {
        api("/posts/" + p_id, Method.GET, { token })
            .then(post =>
            {
                // Add it to all posts
                if (post.ok)
                {
                    const p = post.body as D_Post;
                    loaded_posts.set(p.post_id, p);
                    set_loaded_posts(new Map(loaded_posts));
                }
            })
            .catch()
    }

    useEffect(() =>
    {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(load_post);
    }, [])

    return (
        <div ref={scroll_container}
            className='flex flex-col overflow-scroll overflow-x-hidden snap-mandatory snap-y h-screen items-center'>
            {[...loaded_posts.values()].map(p => (<PostCard className=' max-w-3xl min-h-[100vh] py-20 justify-center snap-center' key={p.post_id} post={p} />))}
        </div>
    )
}

export default SinglePostScroller;
