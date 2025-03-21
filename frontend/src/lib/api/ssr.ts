import { cookies } from "next/headers";

// Server side hook to get token
export const getToken = async (): Promise<string> =>
{
    return (await cookies()).get("token")?.value || "";
}