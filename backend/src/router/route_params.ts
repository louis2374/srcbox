import { Request, Response } from "express";
import { DocParam, DocRoute, DocRouteParams, HandlerFunctionParams, Prim, PrimTS } from "./route_types";

export interface ValidationData
{
    missing:
    {
        path: Array<DocParam>,
        url: Array<DocParam>,
        body: Array<DocParam>
    },
    invalid:
    {
        path: Array<DocParam>,
        url: Array<DocParam>,
        body: Array<DocParam>
    }
}

// Helper funcs to check types
const is_string = (p_test: any) => typeof p_test === "string" && p_test.length > 0;
const is_bool = (p_test: any) => [true, false, "true", "false"].includes(p_test);
const is_num = (p_test: any) => !isNaN(p_test);

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
            return undefined;
    }

    return undefined;
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
        if (!p_req.body) data.missing.body.push(...p_requested.body)

        // Body exists, check each param
        else
        {
            p_requested.body.forEach(param =>
            {
                const exists = (param.name in p_req.body);
                // If the param is required and does not exist
                if (param.required && !exists) data.missing.body.push(param);

                // If the param exists, but is the wrong type
                else if (exists && is(p_req.body[param.name], param.type) === undefined) data.invalid.body.push(param);
            });
        }
    }

    // Ensure all path params are valid
    if (p_requested.path)
    {
        p_requested.path.forEach(param =>
        {
            const exists = (param.name in p_req.params);

            // If the param is required and does not exist
            if (param.required && !exists) data.missing.path.push(param);

            // If the param exists, but is the wrong type
            else if (exists && is(p_req.params[param.name], param.type) === undefined) data.invalid.path.push(param);
        });
    }

    // Ensure all url params are valid
    if (p_requested.url)
    {
        p_requested.url.forEach(param =>
        {
            const exists = (param.name in p_req.query);

            // If the param is required and does not exist
            if (param.required && !exists) data.missing.url.push(param);

            // If the param exists, but is the wrong type
            else if (exists && is(p_req.query[param.name], param.type) === undefined) data.invalid.url.push(param);
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
            if (parsed === undefined && param.required) throw new Error("Param construction failed");
            if (parsed !== undefined) constructed.body![param.name] = parsed;
        })
    }

    if (p_requested.path)
    {
        constructed.path = constructed.path || {};
        p_requested.path.forEach(param => 
        {
            const parsed = is(p_req.params[param.name], param.type);
            if (parsed === undefined && param.required) throw new Error("Param construction failed");
            if (parsed !== undefined) constructed.path![param.name] = parsed;
        })
    }

    if (p_requested.url)
    {
        constructed.url = constructed.url || {};
        p_requested.url.forEach(param => 
        {
            const parsed = is(p_req.query[param.name], param.type);
            if (parsed === undefined && param.required) throw new Error("Param construction failed");
            if (parsed !== undefined) constructed.url![param.name] = parsed;
        })
    }

    return constructed;
}

// Runs the validator on each param if it exists
export const params_validator_run = async (p_res: Response, p_params: HandlerFunctionParams, p_param_info: DocRouteParams) =>
{
    // All params combined to make it easier to loop
    // Its ugly, but basically just joins the two p_params and p_param_info, and combines the param locations
    const all_params: Array<{ value: PrimTS, info: DocParam | undefined }> = [
        ...Object.entries(p_params.body || {}).map(([name, value]) => ({ value, info: (p_param_info.body || []).find((p) => p.name === name) })),
        ...Object.entries(p_params.path || {}).map(([name, value]) => ({ value, info: (p_param_info.path || []).find((p) => p.name === name) })),
        ...Object.entries(p_params.url || {}).map(([name, value]) => ({ value, info: (p_param_info.url || []).find((p) => p.name === name) }))
    ]

    // Check each param
    for (let i = 0; i < all_params.length; i++)
    {
        const info = all_params[i].info;

        if (info?.validator)
        {
            // If there is a validator, run it
            const valid = await info.validator(all_params[i].value, p_res);

            // If the param was not valid, break the loop and return false
            // the validator will handle the request
            if (!valid)
            {
                return false;
            }
        }
    }

    return true;
}