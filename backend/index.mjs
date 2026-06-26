import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "us-east-1" }); 
const BUCKET_NAME = "my-secure-upload-portal-bucket-2026"; 

export const handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const fileName = body.fileName || `upload-${Date.now()}.jpg`;
        const contentType = body.contentType || 'image/jpeg';
        
        // Updated path for HTTP APIs to grab the correct user ID
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub || "anonymous";
        const objectKey = `uploads/${userId}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: objectKey,
            ContentType: contentType
        });

        // THE FIX: Restrict headers so the SDK doesn't inject the empty checksum!
        const uploadUrl = await getSignedUrl(s3Client, command, { 
            expiresIn: 300,
            signableHeaders: new Set(["host", "content-type"])
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization"
            },
            body: JSON.stringify({
                uploadUrl: uploadUrl,
                key: objectKey
            }),
        };
    } catch (error) {
        console.error("Error generating presigned URL", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error", error: error.message }) };
    }
};