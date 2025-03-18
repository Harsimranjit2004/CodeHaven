"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// Validate required environment variables
const requiredEnvVars = [
    'ACCESS_KEY_ID',
    'SECRET_ACCESS_KEY',
    'END_POINT'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
exports.config = {
    aws: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        endpoint: process.env.END_POINT,
        region: process.env.AWS_REGION || 'auto',
        bucketName: process.env.BUCKET_NAME || 'vercel-clone'
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    docker: {
        username: "harsimranjit2004", // Must match DOCKER_USERNAME in app.ts
        personalAccessToken: "Simran@25062", // Must match DOCKER_PASSWORD in app.ts
    },
    domain: "localhost"
};
