import { Response } from "express";
import { ParamValidatorFuncion } from "../router/route_types";
import { std_response_error } from "../router/standard_response";
import { Http, StdAPIErrors } from "@srcbox/library";
import { comment_get_by_id } from "../database/interface/comment";

export const param_validator_comment: ParamValidatorFuncion<number> = async (p_res: Response, p_param: number): Promise<boolean> =>
{
    // This just checks if the comment exists
    try
    {
        const exists = await comment_get_by_id(p_param);

        if (exists) return true;

        // Doesnt exist
        else
        {
            std_response_error(p_res, "comment not found", StdAPIErrors.NOT_FOUND, Http.NOT_FOUND)
            return false;
        }
    }
    catch (e)
    {
        // Failed to check
        std_response_error(p_res, "failed to retrieve comment", StdAPIErrors.UNKNOWN, Http.INTERNAL_SERVER_ERROR)
        return false;
    }
}