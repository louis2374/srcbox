import { cookies } from "next/headers";
import PostCard from "./components/PostCard";
import PostSplitter from "./components/PostSplitter";
import { DB_Post } from "@srcbox/library";

const Home = async () =>
{
    return (
        <div className="max-w-4xl flex flex-1 flex-col justify-center gap-1 pt-8">
            {
                /*
                posts.map((post) =>
                    <div key={post.post_id}>
                        <PostCard post={post} />
                        <PostSplitter />
                    </div>
                )*/
            }
        </div>
    );
}

export default Home;