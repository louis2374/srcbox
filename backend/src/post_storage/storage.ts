import crypto from "crypto";

// Simulating for now
export const post_create_upload_url = (): string =>
{
    return crypto.randomBytes(16).toString("hex");
}

export const post_remove_upload_url = (p_file_id: string) =>
{

}