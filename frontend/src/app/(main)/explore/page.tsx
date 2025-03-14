import PostCard from "./components/PostCard";
import PostSplitter from "./components/PostSplitter";
import { DB_Post } from "@srcbox/library";

const Home = async () =>
{
    const rr: Array<0> = Array.from({ length: 1 })

    const posts: Array<DB_Post> = await (await fetch("http://localhost:4000/posts", { headers: { authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjowLCJpYXQiOjE3NDE5NTAwMzgsImV4cCI6MTc0MzE1OTYzOCwiYXVkIjoiY29tLnNyY2JveC5hdXRoIiwiaXNzIjoiY29tLnNyY2JveC5hdXRoIiwic3ViIjoiMSJ9.0yBb2vm4oxQnNT9IbfdsKsOAwoLm_URv4KBRlz0WIdU" } })).json()

    return (
        <div className="max-w-4xl flex flex-1 flex-col justify-center gap-1 pt-8">
            {
                posts.map((post) =>
                    <div key={post.post_id}>
                        <PostCard post={post} />
                        <PostSplitter />
                    </div>
                )
            }
        </div>
    );
}

export default Home;