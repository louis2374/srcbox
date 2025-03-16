import { Http, StdAPIErrors } from "@srcbox/library";
import { error } from "console";
import { NextApiHandler } from "next";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) =>
{
    try
    {
        const data = await req.json();

        const body = { email: data.email, password: data.password };

        const logged = await fetch("http://localhost:4000/auth/login", {
            body: JSON.stringify(body),
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const parsed = await logged.json();

        // Error / invalid response
        if (!logged.ok || !parsed.token)
        {
            return NextResponse.json({ error: parsed.error || "failed to login", code: parsed.code || StdAPIErrors.UNKNOWN }, { status: logged.status });
        }

        // Success
        const cook = await cookies();
        cook.set("token", parsed.token)
        return NextResponse.json({ message: "success" }, { status: logged.status })
    }
    catch (e)
    {
        return NextResponse.json({ error: "failed to login", code: StdAPIErrors.UNKNOWN }, { status: Http.INTERNAL_SERVER_ERROR });
    }
}