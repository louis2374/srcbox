import PostCard from "./components/PostCard";
import PostSplitter from "./components/PostSplitter";

export default function Home()
{
    const rr: Array<0> = Array.from({ length: 1 })

    return (
        <div className="max-w-4xl flex flex-1 flex-col justify-center gap-1 pt-8">
            {
                rr.map((_, i) =>
                    <>
                        <PostCard key={"pc" + i} />
                        <PostSplitter key={"ps" + i} />
                    </>
                )
            }
        </div>
    );
}