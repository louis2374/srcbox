import { ContentType, DB_User, Http } from "@srcbox/library";
import { BadRequestHandlerFunction, ContentFormat, DocParam, DocResponse, DocRoute, DocRouteFile, EndpointAuthorizer, GenericHandler, HandlerFunction, HandlerFunctionAuth, HandlerFunctionParams, ParamValidatorFuncion, Prim, PrimTS } from "./route_types";

// Used for building a route
// Each function returns a ref to the class so builder syntax can be used
// All func just set that specific key in the object
class DocRouteBuilder
{
    private route: Partial<DocRouteFile> = {};

    summary = (p_summary: string) =>
    {
        this.route.summary = p_summary;
        return this;
    };

    description = (p_description: string) =>
    {
        this.route.description = p_description;
        return this;
    };

    tags = (...p_tags: Array<string>) =>
    {
        this.route.tags = p_tags;
        return this;
    }

    // Add a param
    parameter = (p_location: "path" | "url" | "body", p_name: string, p_type: Prim, p_required: boolean, p_validator?: ParamValidatorFuncion<any>, p_description?: string) =>
    {
        const param: DocParam =
        {
            name: p_name,
            description: p_description,
            type: p_type,
            required: p_required,
            validator: p_validator
        }

        // Create object for params if it does not exist
        if (!this.route.parameters) this.route.parameters = {};

        // Add the param to correct location
        switch (p_location)
        {
            case "path":
                if (this.route.parameters.path) this.route.parameters.path.push(param);
                else this.route.parameters.path = [param];
                break;
            case "url":
                if (this.route.parameters.url) this.route.parameters.url.push(param);
                else this.route.parameters.url = [param];
                break;
            case "body":
                if (this.route.parameters.body) this.route.parameters.body.push(param);
                else this.route.parameters.body = [param];
                break;
        }

        return this;
    }

    response = (p_status_code: Http, p_content_type: ContentType, p_type: ContentFormat, p_description?: string) =>
    {
        const param: DocResponse =
        {
            content_type: p_content_type,
            type: p_type,
            description: p_description
        }

        // Create object for params if it does not exist
        if (!this.route.responses) this.route.responses = {};

        // Set the response
        this.route.responses[p_status_code] = param;

        return this;
    }

    security = (p_security: string) =>
    {
        this.route.security = p_security;
        return this;
    }

    handler = <T extends HandlerFunctionParams>(p_handler: GenericHandler<T>) =>
    {
        // Ensure types match params
        // TODO

        this.route.handler = p_handler;
        return this;
    }

    authoriser = (p_authoriser: EndpointAuthorizer<DB_User>) =>
    {
        this.route.authoriser = p_authoriser;
        return this;
    }

    bad = (p_handler: BadRequestHandlerFunction) =>
    {
        this.route.bad_request_handler = p_handler;
    }

    build = (): DocRouteFile =>
    {
        // Ensure all valid fields are set
        if (!this.route.summary) throw new Error("Failed to build docroute, summary undefined");
        if (!this.route.handler) throw new Error("Failed to build docroute, handler undefined");

        return this.route as DocRouteFile;
    }
}

// Shorthand for the class
export const docroute = () => new DocRouteBuilder();