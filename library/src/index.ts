export * from "./typing/database_types";
export * from "./typing/returnable_types";
export * from "./typing/http";
export * from "./typing/postgres"
export * from "./typing/code"
export * from "./util/dev";
export * from "./util/string"
export * from "./util/console"
export * from "./standards/api_errors"

export const shared = () =>
{
    return "Shared schmingus";
};

export const shared_v2 = () =>
{
    return "DINGLE"
}