import { Http } from "@srcbox/library";
import { Response } from "express";

export const response = (p_res: Response, p_data: Record<string, any>, p_status: Http) =>
{
    p_res.status(p_status).json(p_data);
}

export const response_error = (p_res: Response, p_error: string | Record<string, any>, p_status: Http) =>
{
    p_res.status(p_status).json({ error: p_error });
}