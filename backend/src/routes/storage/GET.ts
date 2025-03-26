import { Http } from "@srcbox/library";
import { docroute } from "../../router/route_builder";
import { HandlerFunctionAuth } from "../../router/route_types";
import { std_response } from "../../router/standard_response";
import { ListBucketsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client(
    {
        region: process.env.AWS_REGION || "",
        credentials:
        {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
    });

const handler: HandlerFunctionAuth<{}> = async (req, res, { }, user) =>
{
    const test_url_presign_code = async (p_name: string): Promise<string> =>
    {
        const command = new PutObjectCommand(
            {
                Bucket: "srcbox-code",
                Key: p_name
            });

        return await getSignedUrl(client, command, { expiresIn: 600 });
    };

    test_url_presign_code("bingus").then(console.log)
    std_response(res, { user }, Http.OK);
};

export default docroute()
    .summary("Test")
    .handler(handler)
    .build();