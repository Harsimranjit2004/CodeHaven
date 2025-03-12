import dotenv from 'dotenv';
import path from "path"

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars = [
    'ACCESS_KEY_ID',
    'SECRET_ACCESS_KEY',
    'END_POINT'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const config = {
    aws: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        endpoint: process.env.END_POINT!,
        region: process.env.AWS_REGION || 'auto',
        bucketName: process.env.BUCKET_NAME || 'vercel-clone'
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    }
} as const; 