import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

// Creates a GUID for a file. I could have used postid, but I want to keep a consistent length
// and maintain seperation
export const post_create_file_id = (): string =>
{
    return crypto.randomUUID();
}

export const post_create_upload_url = async (p_file_id: string): Promise<string> =>
{
    const command = new PutObjectCommand(
        {
            Bucket: "srcbox-code",
            Key: p_file_id
        });

    // Creates a public url to upload a file
    // technically the user could upload anything, however I never
    // run this, and it runs in an iframe, so is of no danger other than bad content.
    const url = await getSignedUrl(s3, command, { expiresIn: 600 });
    return url;
}

// Get content
export const post_get_code = async (p_file_id: string): Promise<string> =>
{
    const command = new GetObjectCommand(
        {
            Bucket: "srcbox-code",
            Key: p_file_id
        });

    try
    {
        const content = await s3.send(command);
        const as_string = content.Body?.transformToString();
        return as_string || "";
    }

    catch (e: any)
    {
        // If its 404, its not an error. I dislike how amazon set this up
        // I prefer an error to actually be an error. 404 is not in my opinion.
        if (e.$metadata.httpStatusCode === 404) return "";
        else throw e;
    }
}