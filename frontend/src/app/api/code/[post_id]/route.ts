import { api } from "@/lib/api/api";
import { html_convert_to_document } from "@/lib/html/document";
import { Http, Method, StdAPIErrors } from "@srcbox/library";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Params
{
    post_id: string
}

// This is a super basic cache, it will not work well with vercel, as it is entirely serverless
// however it should work in a conventional host

// Really it should clear itself, remove older records.
// Dont have time, and there will not be enough posts for this to become a problem
const cache = new Map<number, string>();


// This is a cookie auth wrapper, that converts the code object into a servable html doc.
// Allows me to use iframe without injecting
export const GET = async (req: NextRequest, { params }: { params: Promise<Params> }) =>
{
    const { post_id } = await params;

    // Get user token
    const cook = await cookies();
    const token = cook.get("token")?.value;

    if (!token) return new NextResponse(`<div>You are not authorized to view this page</div>`,
        {
            status: Http.UNAUTHORIZED,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });


    // If in cache, return that
    if (cache.has(+post_id))
    {
        console.log("Cache hit")
        return new NextResponse(cache.get(+post_id),
            {
                status: Http.OK,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            });
    }


    // Fetch the code
    try
    {
        const response = await api("/posts/" + post_id + "/code", Method.GET, { token });

        if (response.ok)
        {

            const { html, css, js } = response.body as { html: string, css: string, js: string };

            const doc = html_convert_to_document(html, css, js);
            // Save in cache
            cache.set(+post_id, doc);

            return new NextResponse(doc,
                {
                    status: Http.OK,
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8',
                    },
                });
        }

        // Not found
        else if (response.status == Http.NOT_FOUND) return new NextResponse(`<div>Not Found</div>`,
            {
                status: Http.NOT_FOUND,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            });

        // Other err
        else return new NextResponse(``,
            {
                status: Http.INTERNAL_SERVER_ERROR,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            });

    }
    catch (e)
    {
        if (!token) return new NextResponse(``,
            {
                status: Http.INTERNAL_SERVER_ERROR,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            });
    }
}