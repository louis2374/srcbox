import path from "path"
import { get_all_files } from "./files";
import { DocRouteFile } from "./route_types";
import { Application } from "express";
import { check_params_valid, construct_params } from "./route_params";

const ROUTE_PATH = process.env.NODE_ENV === "production"
    ?
    "DONT KNOW ATM"
    :
    path.join(__dirname, "..", "routes");

export const parse_routes = async (p_server: Application) =>
{
    const files = get_all_files(ROUTE_PATH);
    files.forEach(async file =>
    {
        // Extract route info METHOD and PATH
        const relative = path.relative(ROUTE_PATH, file).normalize().replace(/\\+/g, "/");
        const route_rel_path = path.dirname(relative);
        const route_path = route_rel_path === "." ? "/" : "/" + route_rel_path;
        const route_method = path.basename(relative).split(".")[0];

        // Load the file
        const obj = (await import(file)).default as DocRouteFile;

        console.log("Loaded route", route_path)
        p_server.get(route_path, (req, res) =>
        {
            if (!obj.parameters)
            {
                obj.handler(req, res, {});
                return
            }

            const param_check = check_params_valid(obj.parameters, req);

            if (param_check !== true)
            {
                if (obj.bad_request_handler) obj.bad_request_handler(req, res, "Boop")
                return;
            }

            const params = construct_params(obj.parameters, req);
            console.log({ params });
            obj.handler(req, res, params);
        })
    })
}