import { StdAPIErrors, Http } from "@srcbox/library";
import { post_get_by_id } from "../database/interface/post";
import { ParamValidatorFuncion } from "../router/route_types";
import { std_response_error } from "../router/standard_response";
import { Response } from "express";
import { MAX_RETURN_COUNT } from "../consts";

export const param_validator_max_count: ParamValidatorFuncion<number> = async (p_param: number, p_res: Response): Promise<boolean> =>
{
    return p_param <= MAX_RETURN_COUNT;
}