import { ContentType, Http, Method } from "@srcbox/library";
import { Request, Response } from "express";


// A route will export this
export interface DocRouteFile
{
    summary: string,
    description?: string,
    tags?: Array<string>,
    parameters?: DocRouteParams,

    responses?: Partial<Record<Http, DocResponse>>,
    security?: string, // This will change
    handler: HandlerFunction<any>,

    // For higher level errors that the router checks, such as missing params
    bad_request_handler?: BadRequestHandlerFunction
}

export interface DocRouteParams
{
    // e.g. users/12
    path?: Array<DocParam>,

    // e.g. users?age=40
    url?: Array<DocParam>,

    // e.g. {"name": "timmy"}
    body?: Array<DocParam>
}

// Extends the file with extra data that must
// be gathered by the router
export interface DocRoute extends DocRouteFile
{
    path: string,
    method: Method,
}

// Documentation for a response
export interface DocResponse
{
    content_type: ContentType,
    type: ContentFormat,
    description?: string
}

export interface DocParam
{
    name: string,
    description?: string,
    type: Prim,
    required: boolean
}

// String types
export type Prim = "string" | "number" | "boolean" | "null";

// Real types
export type PrimTS = string | number | boolean;

// Object to store the type format, so i can have primitive types or an object as content
export type ContentFormat = Prim | { [key: string]: ContentFormat };

export type HandlerFunctionParams = {
    path?: Record<string, PrimTS>,
    url?: Record<string, PrimTS>,
    body?: Record<string, PrimTS>
}

// Allows me to ensure type saftey when defining the function
export type HandlerFunction<T extends HandlerFunctionParams> = (p_request: Request, p_response: Response, p_params: T) => void;

export type BadRequestHandlerFunction = (p_request: Request, p_response: Response, p_error: string) => void;