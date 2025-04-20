"use client"
import FullEditor from "@/components/editor/FullEditor";
import { api, useToken } from "@/lib/api/api";
import { getToken } from "@/lib/api/ssr";
import { D_Post, Method, StdAPIErrors } from "@srcbox/library";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const page: React.FC = () =>
{
    const params = useParams();
    const token = useToken();

    const [loading, set_loading] = useState(true);
    const [err, set_err] = useState("");
    const [content, set_content] = useState<{ js: string, css: string, html: string }>()

    useEffect(() =>
    {
        // Get content
        api("/posts/" + params.post_id + "/code", Method.GET, { token })
            .then(p =>
            {
                if (p.ok) set_content(p.body as { js: string, css: string, html: string });
                else if (p.body.code === StdAPIErrors.POST_NO_CODE)
                {
                    set_err("This post has no content");
                }
                else if (p.body.code === StdAPIErrors.POST_NOT_EDITABLE)
                {
                    set_err("This post is not editable");
                }
                else if (p.body.code === StdAPIErrors.NOT_FOUND)
                {
                    set_err("Not found");
                }
                else set_err("Failed to load code")
            })
            .catch(() =>
            {
                set_err("Failed to load code")
            })
            .finally(() => set_loading(false));
    }, []);

    if (err) return <p>{err}</p>
    if (loading) return <p>Loading</p>
    if (content) return <FullEditor js={content.js} html={content.html} css={content.css} />


}

export default page;