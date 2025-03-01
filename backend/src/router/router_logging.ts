import { ConsoleColor } from "@srcbox/library/src";
import { RouteLoadData } from "./route_types";

const SEPERATOR = ConsoleColor.FgGray + "-".repeat(50) + "\n"
const SEPERATOR_BIG = ConsoleColor.FgGray + "#".repeat(50) + "\n"

// Stringified report of loaded and unloaded routes with errors
export const generate_router_load_report = (p_loaded: Array<RouteLoadData>, p_detailed: boolean = true): string =>
{

    // Title + little info
    let title = "Loaded " + p_loaded.filter(p => !p.error).length + " endpoints:\n";

    // Map the array into {route, method[]} for easier string creation
    const clean_loaded = p_loaded.reduce<Array<{ path: string, endpoints: Array<RouteLoadData> }>>((prev, curr) =>
    {
        // Check if it already exists in the previous array
        const existing = prev.find(v => v.path === curr.path);

        if (existing) existing.endpoints.push(curr);
        else prev.push({ path: curr.path || "__err__", endpoints: [curr] });
        return prev;
    }, [])

    // Create the output string //

    let loaded_string = clean_loaded.reduce<string>((prev, path) =>
    {
        // Path
        let str = SEPERATOR_BIG + "\n" + ConsoleColor.FgCyan + " " + path.path + "\n\n";

        // Endpoint info such as params and summary
        const formatted_endpoints = path.endpoints.map(generate_endpoint_report);

        str += SEPERATOR + formatted_endpoints.join(SEPERATOR) + SEPERATOR;

        return prev + "\n" + str;
    }, "");

    return title + loaded_string + "\n" + SEPERATOR_BIG + ConsoleColor.Reset;
}

const generate_endpoint_report = (p_endpoint: RouteLoadData): string =>
{
    // If it failed to load
    if (p_endpoint.error) return ConsoleColor.FgRed + " - " + p_endpoint.method + " " + ConsoleColor.FgWhite + p_endpoint.error + "\n";

    // Keeping this indented
    const NL = "   ";

    // All below should be green
    let str: string = ConsoleColor.FgGreen;

    // Method
    str += ConsoleColor.FgGreen + " - " + p_endpoint.method + "\n";

    // Summary
    if (p_endpoint.summary) str += NL + p_endpoint.summary + "\n";

    // Params
    if (p_endpoint.parameters)
    {
        const params = p_endpoint.parameters;

        str += NL + "Params:\n";

        if (params.url)
        {
            str += NL + "URL\n"
            params.url.forEach(p =>
            {
                str += NL + "- Name: " + p.name + ", Type: " + p.type + ", Required: " + p.required + "\n";
            })
        }
        if (params.body)
        {
            str += NL + "URL\n"
            params.body.forEach(p =>
            {
                str += NL + "- Name: " + p.name + ", Type: " + p.type + ", Required: " + p.required + "\n";
            })
        }
        if (params.path)
        {
            str += NL + "URL\n"
            params.path.forEach(p =>
            {
                str += NL + "- Name: " + p.name + ", Type: " + p.type + ", Required: " + p.required + "\n";
            })
        }
    }

    return str;
}