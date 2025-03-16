import { cookies } from "next/headers";

// This is simply used for redirecting the user from main to auth if they do not appear to be logged in
// or vice versa

// It is not insecure, as if their login token is invalid, they cannot do anything anyway.
export const auth_soft_is_logged_in = async (): Promise<boolean> =>
{
    const c = await cookies();
    return !!c.get("token")
}

export const auth_get_login_token = async (p_email: string, p_password: string): Promise<string> =>
{
    try
    {
        const body = { email: p_email, password: p_password };

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
            throw new Error("failed to get login token")
        }

        return parsed.token;
    }
    catch (e)
    {
        console.error(e)
        throw new Error("failed to get login token")
    }
}