import { Http, Method, StdAPIErrors } from "@srcbox/library"
import { useCookies } from "next-client-cookies"

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

const cache = new Map<string, { value: APIResponse, created: Date }>();

interface DoCache
{
    path: RegExp,
    method: Method,
    timeout: number // MS
}

const do_cache: Array<DoCache> =
    [
        {
            path: /\/posts\/\d*\/code$/,
            method: Method.GET,
            timeout: 60000
        },
        {
            path: /\/posts\/\d*$/,
            method: Method.GET,
            timeout: 30000
        }
    ]

const get_cache_settings = (p_path: string, p_method: Method): DoCache | undefined =>
{
    return do_cache.find((test) => test.method === p_method && test.path.test(p_path));
}

const check_cache = (p_path: string, p_method: Method) =>
{
    const settings = get_cache_settings(p_path, p_method);

    // Not actively cached
    if (!settings) return;

    const cache_str = build_cache_string(p_path, p_method);

    if (!cache.has(cache_str)) return;

    // Get from cache
    const obj = cache.get(cache_str)!;

    // Timed out
    if (obj.created.getTime() + settings.timeout < Date.now())
    {
        cache.delete(cache_str);
        return;
    }
    else return obj.value;
}

const cache_on_request = (p_path: string, p_method: Method, p_result: APIResponse) =>
{
    // Not actively cached
    if (!get_cache_settings(p_path, p_method)) return;

    // Set in cache
    cache.set(build_cache_string(p_path, p_method), { value: p_result, created: new Date() });
}

const build_cache_string = (p_path: string, p_method: Method) =>
{
    return p_path + ":" + p_method;
}



// Errors will only be thrown if a connection cannot be made to the server, or if the server returns invalid json
export const api = async (p_path: string, p_method: Method, p_options?: ApiOptions): Promise<Readonly<APIResponse>> =>
{
    let url = process.env.NEXT_PUBLIC_API_BASE_HOST + p_path;

    // Cache before query string bc im lazy, I dont really use them so its fine
    const cached = check_cache(p_path, p_method);

    // I create a new promise, as react will batch this otherwise, causing the loading state to bug out.
    // This forces it onto a new frame / tick / loop whatever
    if (cached)
    {
        console.log("Cache HIT", p_path, p_method);
        return new Promise((r) => setTimeout(() => r(cached), 0));
    }
    else console.log("Cache MISS", p_path, p_method);

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
    let response: Response;
    try
    {
        response = await fetch(url, options);
    }
    catch (e)
    {
        console.error(e);
        throw new Error("could not connect to api server: " + url)
    }

    let api_response: APIResponse;

    try
    {
        const text = await response.text();

        // Using the brackets so if text is empty it does not error
        const json = await JSON.parse(text || "{}");

        api_response =
        {
            status: response.status,
            ok: response.ok,
            body: json
        }

        // Set in cache if cached
        cache_on_request(p_path, p_method, api_response)

        return api_response;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("invalid response: " + url)
    }
}