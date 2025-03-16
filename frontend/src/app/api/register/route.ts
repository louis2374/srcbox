import { auth_get_login_token } from "@/lib/auth";
import { Http, StdAPIErrors } from "@srcbox/library";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) =>
{
    let email: string, password: string;
    try
    {
        const data = await req.json();
        email = data.email;
        password = data.password;

        const body = { email, password, username: data.username };

        const logged = await fetch("http://localhost:4000/users", {
            body: JSON.stringify(body),
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const parsed = await logged.json();

        // Error / invalid response
        if (!logged.ok)
        {
            return NextResponse.json({ error: parsed.error || "failed to register", code: parsed.code || StdAPIErrors.UNKNOWN }, { status: logged.status });
        }
    }
    catch (e)
    {
        console.error(e)
        return NextResponse.json({ error: "failed to register", code: StdAPIErrors.UNKNOWN }, { status: Http.INTERNAL_SERVER_ERROR });
    }

    // Now log the user in
    try
    {
        // Get token
        const token = await auth_get_login_token(email, password);

        // Set login token
        const cook = await cookies();
        cook.set("token", token);

        // Done
        return NextResponse.json({ message: "success" }, { status: Http.OK })
    }
    catch (e)
    {
        console.error(e);
        return NextResponse.json({ error: "failed to login after registration", code: StdAPIErrors.ACCOUNT_CREATED_DIDNT_LOGIN }, { status: Http.INTERNAL_SERVER_ERROR });
    }
}