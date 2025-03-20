"use client"
import { api, useToken } from "@/lib/api/api";
import { D_Post, Method } from "@srcbox/library";
import { useEffect, useRef, useState } from "react";
import PostCard from "../../../components/PostCard/PostCard";

const Home = () =>
{
    const posts = useRef<Array<D_Post>>([]);
    const [loading, set_loading] = useState(true)

    const token = useToken();

    const load_new_posts = async () =>
    {
        set_loading(true);

        const response = await api("/posts", Method.GET, { token });

        if (response.ok)
        {
            posts.current = response.body as Array<D_Post>
        }

        set_loading(false);
    }

    useEffect(() =>
    {
        load_new_posts();
    }, [])

    return (
        <div className="w-full max-w-3xl">
            {
                posts.current.map((p) => (<PostCard key={p.post_id} post={p} />))
            }
        </div>
    );
}

export default Home;