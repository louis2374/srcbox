import { Request } from "express";
import { DocRouteParams, HandlerFunctionParams, Prim, PrimTS } from "./route_types";

export interface ValidationData
{
    missing:
    {
        path: Array<string>,
        url: Array<string>,
        body: Array<string>
    },
    invalid:
    {
        path: Array<string>,
        url: Array<string>,
        body: Array<string>
    }
}

// Helper funcs to check types
const is_string = (p_test: any) => typeof p_test === "string";
const is_bool = (p_test: any) => [true, false, "true", "false"].includes(p_test);
const is_num = (p_test: any) => !!Number(p_test);

const is = (p_test: any, p_type: Prim): PrimTS | undefined =>
{
    switch (p_type)
    {
        case "boolean":
            if (is_bool(p_test))
            {
                // Normalises it to bool
                return JSON.parse(p_test);
            }
            else break;
        case "number":
            if (is_num(p_test))
            {
                // Converts to number
                return Number(p_test);
            }
            else break;
        case "string":
            if (is_string(p_test))
            {
                // It is already a string
                return p_test;
            }
            else break;
        default:
            return false;
    }

    return false;
}

// Returns a list of missing and invalid params
// This will be very similar param object construction
// however for simplicity I will keep them seperate
export const check_params_valid = (p_requested: DocRouteParams, p_req: Request): true | ValidationData =>
{
    const data: ValidationData =
    {
        missing:
        {
            path: [],
            url: [],
            body: []
        },
        invalid:
        {
            path: [],
            url: [],
            body: []
        }
    }

    // Ensure all body params are valid
    if (p_requested.body)
    {
        // Body is missing, add all params
        if (!p_req.body) data.missing.body.push(...p_requested.body.map(p => p.name))

        // Body exists, check each param
        else
        {
            p_requested.body.forEach(param =>
            {
                // If the param is required and does not exist
                if (param.required && !(param.name in p_req.body)) data.missing.body.push(param.name);

                // If the param exists, but is the wrong type
                else if (!is(p_req.body[param.name], param.type)) data.invalid.body.push(param.name);
            });
        }
    }

    // Ensure all path params are valid
    if (p_requested.path)
    {
        p_requested.path.forEach(param =>
        {
            // If the param is required and does not exist
            if (param.required && !(param.name in p_req.params)) data.missing.path.push(param.name);

            // If the param exists, but is the wrong type
            else if (!is(p_req.params[param.name], param.type)) data.invalid.path.push(param.name);
        });
    }

    // Ensure all url params are valid
    if (p_requested.url)
    {
        p_requested.url.forEach(param =>
        {
            // If the param is required and does not exist
            if (param.required && !(param.name in p_req.query)) data.missing.url.push(param.name);

            // If the param exists, but is the wrong type
            else if (!is(p_req.query[param.name], param.type)) data.invalid.url.push(param.name);
        });
    }

    // A bit ugly, but checks if any params are invalid
    if (data.invalid.body.length === 0 &&
        data.invalid.path.length === 0 &&
        data.invalid.url.length === 0 &&
        data.missing.body.length === 0 &&
        data.missing.path.length === 0 &&
        data.missing.url.length === 0)
    {
        return true;
    }
    // Invalid params somewhere
    else return data;
}

// This will have undefined behaviour if a param is missing, so check_params_valid must be used first
export const construct_params = (p_requested: DocRouteParams, p_req: Request): HandlerFunctionParams =>
{
    // Params for output
    const constructed: HandlerFunctionParams = {};

    if (p_requested.body)
    {
        constructed.body = constructed.body || {};
        p_requested.body.forEach(param => 
        {
            const parsed = is(p_req.body[param.name], param.type);
            if (!parsed) throw new Error("Param construction failed");
            constructed.body![param.name] = parsed;
        })
    }

    if (p_requested.path)
    {
        constructed.path = constructed.path || {};
        p_requested.path.forEach(param => 
        {
            const parsed = is(p_req.params[param.name], param.type);
            if (!parsed) throw new Error("Param construction failed");
            constructed.path![param.name] = parsed;
        })
    }

    if (p_requested.url)
    {
        constructed.url = constructed.url || {};
        p_requested.url.forEach(param => 
        {
            const parsed = is(p_req.query[param.name], param.type);
            if (!parsed) throw new Error("Param construction failed");
            constructed.url![param.name] = parsed;
        })
    }

    return constructed;
}