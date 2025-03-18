// deploy-service.js
import { createClient, commandOptions } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject, detectFramework } from "./utils";
import axios from "axios";
import path from "path";
import fs from "fs/promises";
import { config } from "./config";
require("dotenv").config();

console.log("Starting deploy-service...");

// Configuration
const DOCKER_REGISTRY = config.docker.registry
const DOCKER_USERNAME = config.docker.username
const DOCKER_PASSWORD = config.docker.password

if (!DOCKER_USERNAME || !DOCKER_PASSWORD) {
  console.error("DOCKER_USERNAME and DOCKER_PASSWORD must be set in .env");
  process.exit(1);
}

// Redis clients
const subscriber = createClient({ url: config.redis.url });
const publisher = createClient({ url: config.redis.url });

async function connectRedisClients() {
  try {
    await subscriber.connect();
    await publisher.connect();
    console.log("Connected to Redis successfully");
  } catch (err: any) {
    console.error("Redis connection error:", err.message);
    process.exit(1);
  }
}
connectRedisClients();

// Update deployment status
async function updateStatus(projectId: any, status: any, message: any, userId: any = "") {
  try {
    await axios.post(`${config.upload_backend.url}/update-status`, { projectId, status, message, userId });
    console.log(`Status updated for project ${projectId} to ${status}`);
  } catch (error: any) {
    console.error(`Failed to update status for project ${projectId}: ${error.message}`);
  }
}

// Cleanup temporary directory
async function cleanupTempDir(projectPath: any) {
  try {
    await fs.rm(projectPath, { recursive: true, force: true });
    console.log(`Cleaned up temporary directory: ${projectPath}`);
  } catch (error: any) {
    console.error(`Failed to clean up directory ${projectPath}: ${error.message}`);
  }
}

// Check Docker daemon status
async function checkDockerDaemon() {
  const { spawn } = require("child_process");
  return new Promise((resolve: any, reject: any) => {
    const dockerInfo = spawn("docker", ["info"]);

    dockerInfo.stdout.on("data", (data: any) => console.log(`Docker info: ${data}`));
    dockerInfo.stderr.on("data", (data: any) => console.error(`Docker error: ${data}`));

    dockerInfo.on("close", (code: any) => {
      if (code === 0) {
        console.log("Docker daemon is running");
        resolve(true);
      } else {
        console.error("Docker daemon is not running");
        reject(new Error("Docker daemon is not running"));
      }
    });

    dockerInfo.on("error", (err: any) => {
      console.error(`Error checking Docker daemon: ${err.message}`);
      reject(err);
    });
  });
}

async function ensureDockerDaemon() {
  try {
    await checkDockerDaemon();
    return true;
  } catch (error: any) {
    console.error("Docker daemon check failed. Please start Docker Desktop manually.", error.message);
    throw error;
  }
}

// Dockerize and push the project
async function dockerizeProject(projectId: any, framework: any) {
  const projectPath = path.join(__dirname, `output/${projectId}`);
  const dockerfilePath = path.join(projectPath, "Dockerfile");
  const imageName = `${DOCKER_USERNAME}/${projectId}:latest`;

  // Create .dockerignore
  const dockerIgnorePath = path.join(projectPath, ".dockerignore");
  const dockerIgnoreContent = `
    node_modules
    .git
    *.md
    *.log
    dist
    build
  `;
  await fs.writeFile(dockerIgnorePath, dockerIgnoreContent);
  console.log(`Created .dockerignore for project ${projectId}`);

  // Generate Dockerfile based on framework
  let dockerfileContent: any = "";
  switch (framework.toLowerCase()) {
    case "next.js":
    case "react":
    case "vue":
      dockerfileContent = `
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install crypto-browserify --save-dev  # Polyfill for crypto
COPY . .
RUN npm run build

# Serve stage
FROM node:18 AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
      `;
      break;
    case "node.js":
      dockerfileContent = `
FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
      `;
      break;
    case "static":
      dockerfileContent = `
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY . .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
      `;
      break;
    default:
      dockerfileContent = `
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install crypto-browserify --save-dev  # Polyfill for crypto
COPY . .
RUN npm run build

# Serve stage
FROM node:18 AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
      `;
  }

  await fs.writeFile(dockerfilePath, dockerfileContent);
  console.log(`Created Dockerfile for project ${projectId} with framework ${framework}`);

  // Ensure Docker daemon is running
  await ensureDockerDaemon();

  const { spawn } = require("child_process");

  return new Promise((resolve: any, reject: any) => {
    // Docker login
    console.log(`Logging into Docker registry ${DOCKER_REGISTRY}...`);
    const login = spawn("docker", ["login", "-u", DOCKER_USERNAME, "--password-stdin", DOCKER_REGISTRY], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let loginOutput: any = "";
    let loginError: any = "";
    let loginTimeout: any;

    login.stdin.write(DOCKER_PASSWORD + "\n"); // Ensure newline for password
    login.stdin.end();

    login.stdout.on("data", (data: any) => {
      loginOutput += data.toString();
      console.log(`Login stdout: ${data}`);
    });

    login.stderr.on("data", (data: any) => {
      loginError += data.toString();
      console.error(`Login stderr: ${data}`);
    });

    login.on("close", (code: any) => {
      clearTimeout(loginTimeout);
      if (code !== 0) {
        console.error(`Docker login failed with code ${code}: ${loginError}`);
        console.warn("Proceeding with build/push using environment variables.");
      } else {
        console.log("Docker login successful");
      }

      // Docker build
      console.log(`Building Docker image ${imageName}...`);
      const build = spawn("docker", ["build", "--no-cache", "-t", imageName, "."], { cwd: projectPath, stdio: "inherit" });

      build.on("close", (code: any) => {
        if (code !== 0) {
          console.error(`Docker build failed with code ${code}`);
          reject(new Error(`Docker build failed with code ${code}`));
          return;
        }
        console.log(`Docker image ${imageName} built successfully`);

        // Docker push
        console.log(`Pushing Docker image ${imageName} to registry...`);
        const push = spawn("docker", ["push", imageName], {
          env: { ...process.env, DOCKER_USERNAME, DOCKER_PASSWORD },
          stdio: "inherit",
        });

        push.on("close", (code: any) => {
          if (code !== 0) {
            console.error(`Docker push failed with code ${code}`);
            reject(new Error(`Docker push failed with code ${code}`));
            return;
          }
          console.log(`Docker image ${imageName} pushed to registry`);
          resolve("");
        });

        push.on("error", (error: any) => {
          console.error(`Docker push error: ${error.message}`);
          reject(error);
        });
      });

      build.on("error", (error: any) => {
        console.error(`Docker build error: ${error.message}`);
        reject(error);
      });
    });

    loginTimeout = setTimeout(() => {
      if (!login.killed) {
        login.kill("SIGTERM");
        console.error("Docker login timed out after 60 seconds");
        console.warn("Proceeding with build/push using environment variables.");
      }
    }, 60000);
  });
}

async function main() {
  let  response:any;
  console.log("Deploy-service main loop started");
  while (true) {
    try {
      console.log("Waiting for build-queue message...");
      response = await subscriber.brPop(commandOptions({ isolated: true }), "build-queue", 0);
      const projectId: any = response.element;
      console.log(`Processing project ${projectId}`);

      await publisher.hSet("status", projectId, "building");
      await updateStatus(projectId, "building", "Starting build process...");
      console.log(`Starting build for project ${projectId}`);

      const projectPath: any = path.join(__dirname, `output/${projectId}`);
      await downloadS3Folder(`output/${projectId}`);
      console.log(`Downloaded S3 folder for project ${projectId}`);

      const framework: any = await detectFramework(projectPath);
      await buildProject(projectId, framework);
      console.log(`Built project ${projectId} with ${framework} framework`);

      await dockerizeProject(projectId, framework);
      console.log(`Dockerized and pushed image for project ${projectId}`);

      await publisher.hSet("status", projectId, "deployed");
      await updateStatus(projectId, "deployed", `Deployment completed with ${framework} framework`);
      console.log(`Project ${projectId} deployed successfully`);
    } catch (error: any) {
      console.error(`Build failed for project ${response?.element}:`, error.message);
      const projectId: any = response?.element;
      if (projectId) {
        await publisher.hSet("status", projectId, "failed");
        await updateStatus(projectId, "failed", `Build failed: ${error.message || "Unknown error"}`);
        await cleanupTempDir(path.join(__dirname, `output/${projectId}`));
        console.log(`Cleanup completed for failed project ${projectId}`);
      }
    }
  }
}

main().catch((err: any) => {
  console.error("Main loop error:", err.message);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await subscriber.quit();
  await publisher.quit();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await subscriber.quit();
  await publisher.quit();
  process.exit(0);
});