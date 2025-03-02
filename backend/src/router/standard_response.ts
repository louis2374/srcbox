import { Http, StdAPIErrors } from "@srcbox/library";
import { Response } from "express";

export const std_response = (p_res: Response, p_data: Record<string, any>, p_status: Http) =>
{
    p_res.status(p_status).json(p_data);
}

export const std_response_error = (p_res: Response, p_error: string | Record<string, unknown>, p_code: StdAPIErrors, p_status: Http) =>
{

    p_res.status(p_status).json({ error: p_error, code: p_code });
}