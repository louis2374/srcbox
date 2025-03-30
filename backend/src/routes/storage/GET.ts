import { Http } from "@srcbox/library";
import { docroute } from "../../router/route_builder";
import { HandlerFunctionAuth } from "../../router/route_types";
import { std_response } from "../../router/standard_response";
import { ListBucketsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../post_storage/s3";

const handler: HandlerFunctionAuth<{}> = async (req, res, { }, user) =>
{
    const test_url_presign_code = async (p_name: string): Promise<string> =>
    {
        const command = new PutObjectCommand(
            {
                Bucket: "srcbox-code",
                Key: p_name
            });

        return await getSignedUrl(s3, command, { expiresIn: 600 });
    };

    test_url_presign_code("bingus").then(console.log)
    std_response(res, { user }, Http.OK);
};

export default docroute()
    .summary("Test")
    .handler(handler)
    .build();