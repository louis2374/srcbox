import { Http, Method, StdAPIErrors } from "@srcbox/library"
import { useCookies } from "next-client-cookies"
import { CookiesProvider, getCookies } from "next-client-cookies/server"

export interface ApiOptions
{
    query_params?: Record<string, string>,
    body?: Record<string, string>,
    token?: string
}

export interface APIResponse extends Record<string, unknown>
{
    status: Http,
    ok: boolean,
    body:
    {
        // If error
        error?: string,
        code?: StdAPIErrors
    }
}

// Client side hook to get token
export const useToken = () =>
{
    const cookies = useCookies();

    return cookies.get("token") || "";
}

// Errors will only be thrown if a connection cannot be made to the server, or if the server returns invalid json
export const api = async (p_path: string, p_method: Method, p_options?: ApiOptions): Promise<APIResponse> =>
{
    let url = process.env.NEXT_PUBLIC_API_BASE_HOST + p_path;

    // Add query if they exist
    if (p_options?.query_params && Object.keys(p_options.query_params).length > 0)
    {
        url += "?" + new URLSearchParams(p_options.query_params).toString()
    }

    const options: Record<string, any> = { method: p_method };

    // Set json if there is a body, and add it
    if (p_options?.body)
    {
        options.headers = { "Content-Type": "application/json" }
        options.body = JSON.stringify(p_options.body)
    }

    // Apply auth if required
    if (p_options?.token)
    {
        options.headers = { ...options.headers || {}, "authorization": "Bearer " + p_options.token }
    }

    try
    {
        const response = await fetch(url, options);

        const json = await response.json();

        return {
            status: response.status,
            ok: response.ok,
            body: json
        }
    }
    catch (e)
    {
        console.error(e);
        throw new Error("could not connect to api server: " + url)
    }
}