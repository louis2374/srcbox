"use client"
import { api, useToken } from "@/lib/api/api";
import { D_Post, Method } from "@srcbox/library";
import { useRef, useState } from "react";
import PostCard from "./components/PostCard";

const Home = () =>
{
    const posts = useRef<Array<D_Post>>([]);
    const [loading, set_loading] = useState(true)

    const token = useToken();

    const click = async () =>
    {
        const response = await api("/posts", Method.GET, { token });

        if (response.ok)
        {
            posts.current = response.body as Array<D_Post>
        }

        set_loading(false);
    }

    return (
        <div className="">
            <button onClick={click}>Click</button>
            {
                posts.current.map((p) => (<PostCard key={p.post_id} post={p} />))
            }
        </div>
    );
}

export default Home;