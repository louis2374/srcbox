// All http methods
export enum Method
{
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

// Just going to add these as I need them
export enum Http
{
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    NO_CONTENT = 204
}

// Added as I need them
export enum ContentType
{
    JSON = "application/json"
}