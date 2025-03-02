import path from "path"
import { get_all_files } from "./files";
import { DocRoute, DocRouteFile, HandlerFunction, HandlerFunctionAuth, RouteLoadData } from "./route_types";
import { Application, Handler, Request, Response } from "express";
import { check_params_valid, construct_params } from "./route_params";
import { Http, is_ts_node, Method, StdAPIErrors } from "@srcbox/library";
import { generate_preprocess_error } from "./router_preprocess_error";
import { std_response_error } from "./standard_response";
import { ConsoleColor, count_chars } from "@srcbox/library/src";
import { generate_router_load_report } from "./router_logging";

// Root of all endpoints
const ROUTE_PATH = path.join(__dirname, "..", "routes");

// Files will be either ts or js, depending on how this is run
const ROUTE_ENDING = is_ts_node() ? ".ts" : ".js";

export const parse_routes = async (p_server: Application) =>
{
    // Routes than failed or succeeded to load, for logging
    const all_routes: Array<RouteLoadData> = [];

    const files = get_all_files(ROUTE_PATH);
    await Promise.all(files.map(async file =>
    {
        // Only check files with correct ending
        if (path.extname(file) !== ROUTE_ENDING) return;

        // Extract route info METHOD and PATH
        const path_data = extract_path_data(file);

        // Invalid method, as path cannot fail
        if (!is_valid_path_data(path_data))
        {
            all_routes.push({ path: path_data.path, method: path_data.method, error: `File name is an invalid HTTP method.` });
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
        all_routes.push(route);
    }));

    // Log the report

    console.log(generate_router_load_report(all_routes));
}

const extract_path_data = (p_file_name: string): { path: string, method: string } =>
{
    // Get path relative to . of the route file
    const relative = path.relative(ROUTE_PATH, p_file_name).normalize().replace(/\\+/g, "/");
    const route_rel_path = path.dirname(relative);
    const route_path = route_rel_path === "." ? "/" : "/" + route_rel_path;
    const route_method = path.basename(relative).split(".")[0];

    return { path: route_path, method: route_method };
}

// Typeguard for ensuring its valid
const is_valid_path_data = (p_data: { path: string, method: string }): p_data is { path: string, method: Method } =>
{
    return p_data.method in Method;
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
    method_function_map[p_route.method](p_route.path, async (req: Request, res: Response) =>
    {
        // This is run every call to the route

        // If an authoriser is set, call it first
        let auth_user: number | undefined = undefined;
        if (p_route.authoriser)
        {
            auth_user = await p_route.authoriser(req.headers);
            if (auth_user == undefined || auth_user < 1)
            {
                std_response_error(res, "unauthorised", StdAPIErrors.UNAUTHORIZED, Http.UNAUTHORIZED)
                return;
            }
        }


        // If no params, call the hander immediately
        if (!p_route.parameters)
        {
            (p_route.handler as HandlerFunctionAuth<{}>)(req, res, {}, auth_user as number);
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
                std_response_error(res, error, StdAPIErrors.BAD_PARAMS, Http.BAD_REQUEST);
            }
            return;
        }

        // Build params, and call the handler with them
        const params = construct_params(p_route.parameters, req);

        // A little type unsafe, however so long as
        // the endpoint is setup, it should be ok
        (p_route.handler as HandlerFunctionAuth<{}>)(req, res, params, auth_user as number);
    })
}