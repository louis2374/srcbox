import path from "path"
import { get_all_files } from "./files";
import { DocRoute, DocRouteFile } from "./route_types";
import { Application, Request, Response } from "express";
import { check_params_valid, construct_params } from "./route_params";
import { Http, is_ts_node, Method } from "@srcbox/library";
import { generate_preprocess_error } from "./router_preprocess_error";
import { response_error } from "./standard_response";

const ROUTE_PATH = process.env.NODE_ENV === "production"
    ?
    path.join(__dirname, "..", "routes")
    :
    path.join(__dirname, "..", "routes");

// Files will be either ts or js
const ROUTE_ENDING = is_ts_node() ? ".ts" : ".js";

export const parse_routes = async (p_server: Application) =>
{
    // Routes than failed or succeeded to load, for logging
    const loaded_routes: Array<DocRoute> = [];
    const unloaded_routes: Array<{ route: string, error: string }> = [];

    const files = get_all_files(ROUTE_PATH);
    await Promise.all(files.map(async file =>
    {
        // Only check files with correct ending
        if (path.extname(file) !== ROUTE_ENDING) return;

        // Extract route info METHOD and PATH
        const path_data = extract_path_data(file);

        // Invalid method, as path cannot fail
        if (!path_data)
        {
            unloaded_routes.push({ route: file, error: `File name is an invalid HTTP method.` });
            return;
        }

        // Load the file
        const docroutefile = (await import(file)).default as DocRouteFile;

        // Combine path data to a full docroute
        const route: DocRoute =
        {
            ...docroutefile,
            ...path_data
        }

        // TODO - ensure it is a valid docroute
        // this includes extra checks such as ensuring GET does not have body params

        // Load the route into express
        assign_route(route, p_server);

        // Add to complete routes for logging
        loaded_routes.push(route);
    }));

    // Log the report

    console.log(generate_route_report(loaded_routes, unloaded_routes));
}

const extract_path_data = (p_file_name: string): { path: string, method: Method } | undefined =>
{
    // Get path relative to . of the route file
    const relative = path.relative(ROUTE_PATH, p_file_name).normalize().replace(/\\+/g, "/");
    const route_rel_path = path.dirname(relative);
    const route_path = route_rel_path === "." ? "/" : "/" + route_rel_path;
    const route_method = path.basename(relative).split(".")[0];

    // Invalid file name
    if (!(route_method in Method)) return undefined;

    return { path: route_path, method: route_method as Method };
}

const assign_route = (p_route: DocRoute, p_server: Application) =>
{
    // I map these to the name, so that I can easy determine the function given the Method type
    // This is constructed each time but not really a problem
    const method_function_map: Record<Method, Function> =
    {
        [Method.GET]: p_server.get.bind(p_server),
        [Method.POST]: p_server.post.bind(p_server),
        [Method.PATCH]: p_server.patch.bind(p_server),
        [Method.PUT]: p_server.put.bind(p_server),
        [Method.DELETE]: p_server.delete.bind(p_server)
    };

    // Assign the valid route
    method_function_map[p_route.method](p_route.path, (req: Request, res: Response) =>
    {
        // This is run every call to the route

        // If no params, call the hander immediately
        if (!p_route.parameters)
        {
            p_route.handler(req, res, {});
            return;
        }

        // Generates a list of missing of invalid params, if any
        const param_check = check_params_valid(p_route.parameters, req);

        // If params have an error
        if (param_check !== true)
        {
            // If custom handler
            if (p_route.bad_request_handler) p_route.bad_request_handler(req, res, "parameter");

            // Default handler
            else
            {
                // Generate error and send it
                const error = generate_preprocess_error(param_check);
                response_error(res, error, Http.BAD_REQUEST);
            }
            return;
        }

        // Build params, and call the handler with them
        const params = construct_params(p_route.parameters, req);
        p_route.handler(req, res, params);
    })
}

// Stringified report of loaded and unloaded routes with errors
const generate_route_report = (p_loaded: Array<DocRoute>, p_unloaded: Array<{ route: string, error: string }>): string =>
{
    let out = "";
    p_loaded.forEach(route =>
    {
        out += route.path + " " + route.method + "\n";
    })
    return out;
}