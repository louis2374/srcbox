import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { NextRequest } from "next/server";

export const check_auth_redirect = async () =>
{
    const c = await cookies();
    if (c.get("test")?.value === "bingus")
    {
        permanentRedirect("/explore")
    }
}