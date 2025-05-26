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
import Comments from '../CommentBox/Comments';

interface Props
{
    top?: number // The top/starting post, if undefined will be random
}

const page_size = 5;

const SinglePostScroller: React.FC<Props> = () =>
{
    const token = useToken();
    const scroll_container = useRef<HTMLDivElement>(null);
    const [loaded_posts, set_loaded_posts] = useState<Array<D_Post>>([]);
    const observer = useRef<IntersectionObserver>(null);
    const offset = useRef(0);
    const loading_posts = useRef(false);
    const [show_comments, set_show_comments] = useState(false);

    // Index inside posts array of the current post
    // Allows me to only preload posts a few positions away
    const [current_visible_index, set_current_visible_index] = useState(0);

    useEffect(() =>
    {
        observer.current = build_observer();

        const scrolled = () =>
        {
            const s = scroll_container.current!;
            const bottom_distance = s.scrollHeight - s.scrollTop - s.clientHeight; // Distance from bottom

            // Multipling client height to add a little leeway
            if (bottom_distance < s.clientHeight * page_size * 1.1) load_new_posts();
        }

        document.addEventListener("wheel", scrolled);

        // Trigger load immediately
        scrolled();

        return () => 
        {
            document.removeEventListener("wheel", scrolled);
            observer.current?.disconnect();
        }
    }, []);

    useEffect(() =>
    {
        if (!observer.current || !scroll_container.current) return;

        // Empty it
        observer.current.disconnect();

        // Add all posts
        Array.from(scroll_container.current.children).forEach(observer.current.observe.bind(observer.current));
    }, [loaded_posts])

    const load_new_posts = () =>
    {
        if (loading_posts.current) return;
        loading_posts.current = true;
        api("/posts", Method.GET, { token, query_params: { offset: offset.current + "", limit: page_size + "" } })
            .then((response) =>
            {
                if (!response.ok) 
                {
                    console.error(response.body.error);
                    return;
                }

                const posts = response.body as Array<D_Post>;

                posts.forEach(post =>
                {
                    // Occasionally when using back arrows posts would be duplicated
                    // This fixes it. Not that big of a deal, I know this is n squared,
                    // however the list will never be that large, and its very quick to loop through
                    if (!loaded_posts.find(p => p.post_id === post.post_id))
                    {
                        set_loaded_posts(prev => [...prev, post]);
                    }
                });
                offset.current = offset.current + posts.length;
            })

            // Minimum time between loads is 3s
            .finally(() => setTimeout(() => loading_posts.current = false, 2000))
    }

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
                    //set_post_in_url(Number(entry.target.getAttribute("data-id")));
                    set_post_in_url(+(entry.target.getAttribute("data-index") || 0));

                    set_current_visible_index(+(entry.target.getAttribute("data-index") || 0))
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



    useEffect(() =>
    {
        load_new_posts();
    }, [])

    return (
        <div
            ref={scroll_container}
            className='flex flex-col overflow-scroll overflow-x-hidden snap-mandatory snap-y h-screen items-center no-scrollbar'
        >
            {loaded_posts.map((p, i) => (
                <div
                    data-index={i}
                    key={p.post_id}
                    className='flex flex-row w-full min-h-[100vh] py-20 justify-center snap-center gap-8 px-10'
                >
                    <PostCard button_pressed={(b) => b == "comment" ? set_show_comments(!show_comments) : ""} className=' max-w-3xl justify-center snap-center' post={p} />
                    {show_comments && <Comments post_id={p.post_id} />}
                </div>))}
        </div>
    )
}

export default SinglePostScroller;
