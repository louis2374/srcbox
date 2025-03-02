import { Response } from "express";
import { ParamValidatorFuncion } from "../route_types";
import { post_exists } from "../../database/interface/post";
import { std_response_error } from "../standard_response";
import { Http, StdAPIErrors } from "@srcbox/library";

export const param_validator_post: ParamValidatorFuncion<number> = async (p_res: Response, p_param: number): Promise<boolean> =>
{
    console.log("VALIDATOR")
    // This just checks if the post exists
    try
    {
        const exists = await post_exists(p_param);

        if (exists) return true;

        // Doesnt exist
        else
        {
            std_response_error(p_res, "post does not exist", StdAPIErrors.POST_NOT_FOUND, Http.NOT_FOUND)
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