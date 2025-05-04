import { StdAPIErrors, Http } from "@srcbox/library";
import { post_get_by_id } from "../database/interface/post";
import { ParamValidatorFuncion } from "../router/route_types";
import { std_response_error } from "../router/standard_response";
import { Response } from "express";
import { MAX_RETURN_COUNT } from "../consts";

export const param_validator_max_count: ParamValidatorFuncion<number> = async (p_param: number, p_res: Response): Promise<boolean> =>
{
    if (p_param > MAX_RETURN_COUNT)
    {
        std_response_error(p_res, "Param limit must be less than or equal to " + MAX_RETURN_COUNT, StdAPIErrors.BAD_PARAMS, Http.BAD_REQUEST);
        return false;
    }
    return true;
}

export const param_validator_sort_direction: ParamValidatorFuncion<string> = async (p_param: string, p_res: Response): Promise<boolean> =>
{
    if (!["asc", "desc"].includes(p_param))
    {
        std_response_error(p_res, "Param sort_direction must be either \"asc\" or \"desc\"", StdAPIErrors.BAD_PARAMS, Http.BAD_REQUEST);
        return false;
    }
    return true;
}    