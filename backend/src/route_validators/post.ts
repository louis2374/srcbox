import { Response } from "express";
import { ParamValidatorFuncion } from "../router/route_types";
import { post_get_by_id } from "../database/interface/post";
import { std_response_error } from "../router/standard_response";
import { Http, StdAPIErrors } from "@srcbox/library";

export const param_validator_post: ParamValidatorFuncion<number> = async (p_param: number, p_res: Response): Promise<boolean> =>
{
    // This just checks if the post exists
    try
    {
        const exists = await post_get_by_id(p_param);

        if (exists) return true;

        // Doesnt exist
        else
        {
            std_response_error(p_res, "post not found", StdAPIErrors.NOT_FOUND, Http.NOT_FOUND)
            return false;
        }
    }
    catch (e)
    {
        // Failed to check
        std_response_error(p_res, "failed to retrieve post", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
        return false;
    }
}