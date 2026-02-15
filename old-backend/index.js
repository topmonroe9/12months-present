// index.js - Lambda function for Yandex Cloud

// Import dependencies
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { gift1Content, gift2Content, siteConfig } from "./content.js";

// Initialize Yandex Cloud Object Storage client
// Note: AWS S3 SDK is compatible with Yandex Cloud Object Storage
const s3Client = new S3Client({
    region: "ru-central1", // Yandex Cloud region
    endpoint: "https://storage.yandexcloud.net", // Yandex Cloud endpoint
    credentials: {
        accessKeyId: process.env.YANDEX_ACCESS_KEY_ID,
        secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Required for Yandex Cloud Object Storage
});

const PINCODE = process.env.PINCODE;

// Helper function to generate presigned URLs
const getPresignedUrl = async (key) => {
    try {
        const cleanKey = key.startsWith("/") ? key.slice(1) : key;

        const command = new GetObjectCommand({
            Bucket: process.env.YANDEX_BUCKET_NAME,
            Key: cleanKey,
        });

        console.log("Generating presigned URL for:", {
            bucket: process.env.YANDEX_BUCKET_NAME,
            key: cleanKey,
        });

        return await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        throw error;
    }
};

// Helper function to process content objects
const processObject = async (obj) => {
    // Handle arrays
    if (Array.isArray(obj)) {
        return Promise.all(obj.map((item) => processObject(item)));
    }

    // Handle objects
    if (obj && typeof obj === "object") {
        const processed = {};

        for (const [key, value] of Object.entries(obj)) {
            // Convert src properties to presigned URLs
            if (key === "src" && typeof value === "string") {
                try {
                    processed[key] = await getPresignedUrl(value);
                } catch (error) {
                    console.error(`Failed to get presigned URL for ${value}:`, error);
                    // Preserve original value if presigning fails
                    processed[key] = value;
                }
            }
            // Special handling for music or backgroundMusic property at root level
            else if (
                (key === "music" || key === "backgroundMusic") &&
                typeof value === "string"
            ) {
                try {
                    processed[key] = await getPresignedUrl(value);
                } catch (error) {
                    console.error(
                        `Failed to get presigned URL for music ${value}:`,
                        error
                    );
                    processed[key] = value;
                }
            }
            // Recursively process nested objects and arrays
            else if (typeof value === "object" && value !== null) {
                processed[key] = await processObject(value);
            }
            // Keep other properties as is
            else {
                processed[key] = value;
            }
        }

        return processed;
    }

    // Return primitive values as is
    return obj;
};

/**
 * Yandex Cloud Functions handler
 *
 * @param {Object} event - The event object from Yandex Cloud Functions
 * @param {Object} context - The context object
 * @returns {Object} Response object
 */
export const handler = async (event, context) => {
    // For HTTP API Gateway triggers in Yandex Cloud
    const httpMethod = event.httpMethod || "";
    let requestBody = {};

    try {
        // Parse request body if it's a string
        if (event.body && typeof event.body === "string") {
            requestBody = JSON.parse(event.body);
        } else if (event.body) {
            requestBody = event.body;
        }
    } catch (e) {
        console.error("Error parsing request body:", e);
        requestBody = {};
    }

    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    // Handle OPTIONS request for CORS
    if (httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "",
        };
    }

    // Only allow POST method
    if (httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                success: false,
                message: "Method not allowed",
            }),
        };
    }

    try {
        // Extract pincode from the request body
        const { pincode } = requestBody;

        // Check pincode
        if (!pincode || pincode !== PINCODE) {
            return {
                statusCode: 401,
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    success: false,
                    message: "Invalid pincode",
                }),
            };
        }

        // Process all content
        const [processedGift1, processedGift2, processedConfig] =
            await Promise.all([
                processObject(gift1Content),
                processObject(gift2Content),
                processObject(siteConfig),
            ]);

        // Return successful response
        return {
            statusCode: 200,
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                success: true,
                data: {
                    ...processedConfig,
                    gift1: processedGift1,
                    gift2: processedGift2,
                },
            }),
        };
    } catch (error) {
        console.error("Error:", error);

        // Return error response
        return {
            statusCode: 500,
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                success: false,
                message: "Internal server error",
                error: error.message,
            }),
        };
    }
};
