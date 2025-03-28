import dotenv from 'dotenv';
import path from 'path';

// Define a type for the required environment variables
type RequiredEnvVars = 'ACCESS_KEY_ID' | 'SECRET_ACCESS_KEY' | 'END_POINT';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars: RequiredEnvVars[] = [
    'ACCESS_KEY_ID',
    'SECRET_ACCESS_KEY',
    'END_POINT',
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// Define the shape of the AWS configuration
interface AwsConfig {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    region: string;
    bucketName: string;
}

// Define the shape of the Redis configuration
interface RedisConfig {
    url: string;
}

// Define the shape of the CORS configuration
interface CorsConfig {
    origin: string | string[]; // Can be a single string or an array of strings
}

// Define the overall configuration shape
interface Config {
    aws: AwsConfig;
    redis: RedisConfig;
    cors: CorsConfig; // Add CORS configuration
}

// Export the config object with type safety
export const config: Config = {
    aws: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        endpoint: process.env.END_POINT!,
        region: process.env.AWS_REGION || 'auto',
        bucketName: process.env.BUCKET_NAME || 'vercel-clone',
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*', // Default to '*' if not set in .env
    },
} as const;