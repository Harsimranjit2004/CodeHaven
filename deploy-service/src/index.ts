// deploy-service.js
import { createClient, commandOptions } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject, detectFramework } from "./utils";
import axios from "axios";
import path from "path";
import fs from "fs/promises";
require("dotenv").config();

console.log("Starting deploy-service...");

const DOCKER_REGISTRY = process.env.DOCKER_REGISTRY || "docker.io";
const DOCKER_USERNAME = process.env.DOCKER_USERNAME || "harsimranjit2004";
const DOCKER_PASSWORD = process.env.DOCKER_PASSWORD || "Simran@25062";

if (!DOCKER_USERNAME || !DOCKER_PASSWORD) {
  console.error("DOCKER_USERNAME and DOCKER_PASSWORD must be set in .env");
  process.exit(1);
}

const subscriber = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
const publisher = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });

async function connectRedisClients() {
  try {
    await subscriber.connect();
    await publisher.connect();
    console.log("Connected to Redis");
  } catch (err: any) {
    console.error("Redis connection error:", err);
    process.exit(1);
  }
}
connectRedisClients();

async function updateStatus(projectId: any, status: any, message: any, userId: any = "") {
  try {
    await axios.post("http://localhost:3000/update-status", {
      projectId,
      status,
      message,
      userId,
    });
    console.log(`Updated status for project ${projectId} to ${status}`);
  } catch (error: any) {
    console.error(`Failed to update status for project ${projectId}:`, error.message);
  }
}

async function cleanupTempDir(projectPath: any) {
  try {
    await fs.rm(projectPath, { recursive: true, force: true });
    console.log(`Cleaned up temporary directory: ${projectPath}`);
  } catch (error: any) {
    console.error(`Failed to clean up directory ${projectPath}:`, error);
  }
}
// deploy-service.js (Updated dockerizeProject function)
// deploy-service.js (Updated dockerizeProject function)
async function dockerizeProject(projectId: any, framework: any) {
  const projectPath = path.join(__dirname, `output/${projectId}`);
  const dockerfilePath = path.join(projectPath, "Dockerfile");
  const imageName = `${DOCKER_USERNAME}/${projectId}:latest`;

  // Create .dockerignore to optimize build
  const dockerIgnorePath = path.join(projectPath, ".dockerignore");
  const dockerIgnoreContent = `
    node_modules
    .git
    *.md
    *.log
  `;
  await fs.writeFile(dockerIgnorePath, dockerIgnoreContent);
  console.log(`Created .dockerignore for project ${projectId}`);

  let dockerfileContent = "";
  switch (framework.toLowerCase()) {
    case "next.js":
    case "react":
      dockerfileContent = `
        FROM node:16.20
        WORKDIR /app
        COPY . /app
        RUN npm install
        RUN npm run build -- --debug
        CMD ["npx", "serve", "-s", "build", "-l", "8080"]
        EXPOSE 8080
      `;
      break;
    case "node.js":
      dockerfileContent = `
        FROM node:16.20
        WORKDIR /app
        COPY . /app
        RUN npm install
        CMD ["node", "server.js"]
        EXPOSE 8080
      `;
      break;
    case "vue":
      dockerfileContent = `
        FROM node:16.20
        WORKDIR /app
        COPY . /app
        RUN npm install
        RUN npm run build
        CMD ["npx", "serve", "-s", "dist", "-l", "8080"]
        EXPOSE 8080
      `;
      break;
    case "static":
      dockerfileContent = `
        FROM nginx:alpine
        COPY . /app
        EXPOSE 80
      `;
      break;
    default:
      dockerfileContent = `
        FROM node:16.20
        WORKDIR /app
        COPY . /app
        RUN npm install
        RUN npm run build
        CMD ["npx", "serve", "-s", "build", "-l", "8080"]
        EXPOSE 8080
      `;
  }

  await fs.writeFile(dockerfilePath, dockerfileContent);
  console.log(`Created Dockerfile for project ${projectId}`);

  // Ensure Docker daemon is running before proceeding


  const { spawn } = require("child_process");

  return new Promise((resolve, reject) => {
    // Programmatic Docker login with increased timeout and debugging
    console.log(`Attempting to log into Docker registry ${DOCKER_REGISTRY}...`);
    const login = spawn("docker", ["login", "-u", DOCKER_USERNAME, "--password-stdin", DOCKER_REGISTRY], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let loginOutput = "";
    let loginError = "";
    let loginTimeout: NodeJS.Timeout;

    login.stdin.write(DOCKER_PASSWORD);
    login.stdin.end();

    login.stdout.on("data", (data: any) => {
      loginOutput += data.toString();
      console.log(`Docker login stdout: ${data}`);
    });

    login.stderr.on("data", (data: any) => {
      loginError += data.toString();
      console.error(`Docker login stderr: ${data}`);
    });

    login.on("error", (error: any) => {
      console.error(`Docker login process error:`, error);
      clearTimeout(loginTimeout);
      reject(error);
    });

    login.on("close", (code: any) => {
      clearTimeout(loginTimeout);
      if (code !== 0) {
        console.error(`Docker login failed with code ${code}. Error: ${loginError}`);
        console.warn("Login failed, attempting build/push with environment variables. Ensure credentials are valid.");
      } else {
        console.log("Docker login successful");
      }

      // Docker build
      console.log(`Building Docker image ${imageName}...`);
      const build = spawn("docker", ["build", "-t", imageName, "."], { cwd: projectPath });

      let buildOutput = "";
      let buildError = "";

      build.stdout.on("data", (data: any) => {
        buildOutput += data.toString();
        console.log(`Docker build stdout: ${data}`);
      });

      build.stderr.on("data", (data: any) => {
        buildError += data.toString();
        console.error(`Docker build stderr: ${data}`);
      });

      build.on("error", (error: any) => {
        console.error(`Docker build process error:`, error);
        reject(error);
      });

      build.on("close", (code: any) => {
        if (code !== 0) {
          console.error(`Docker build failed with code ${code}. Error: ${buildError}`);
          reject(new Error(`Docker build failed with code ${code}`));
          return;
        }
        console.log(`Docker image ${imageName} built successfully`);

        // Docker push with environment variables for authentication
        console.log(`Pushing Docker image ${imageName} to registry...`);
        const push = spawn("docker", ["push", imageName], {
          env: {
            ...process.env,
            DOCKER_USERNAME,
            DOCKER_PASSWORD,
          },
        });

        let pushOutput = "";
        let pushError = "";

        push.stdout.on("data", (data: any) => {
          pushOutput += data.toString();
          console.log(`Docker push stdout: ${data}`);
        });

        push.stderr.on("data", (data: any) => {
          pushError += data.toString();
          console.error(`Docker push stderr: ${data}`);
        });

        push.on("error", (error: any) => {
          console.error(`Docker push process error:`, error);
          reject(error);
        });

        push.on("close", (code: any) => {
          if (code !== 0) {
            console.error(`Docker push failed with code ${code}. Error: ${pushError}`);
            reject(new Error(`Docker push failed with code ${code}`));
            return;
          }
          console.log(`Docker image ${imageName} pushed to registry`);
          resolve("");
        });
      });
    });

    loginTimeout = setTimeout(() => {
      if (!login.killed) {
        login.kill("SIGTERM");
        console.error("Docker login timed out after 60 seconds. Error: No response from Docker registry.");
        console.warn("Login timed out, attempting build/push with environment variables.");
      }
    }, 60000); // 60-second timeout
  });
}
async function main() {
  console.log("Deploy-service main loop started");
  let response: any;
  while (true) {
    try {
      console.log("Waiting for build-queue message...");
      response = await subscriber.brPop(commandOptions({ isolated: true }), "build-queue", 0);
      const projectId = response.element;
      console.log(`Processing project ${projectId}`);

      await publisher.hSet("status", projectId, "building");
      await updateStatus(projectId, "building", "Starting build process...");
      console.log(`Starting build for project ${projectId}`);

      const projectPath = path.join(__dirname, `output/${projectId}`);
      await downloadS3Folder(`output/${projectId}`);
      console.log(`Downloaded S3 folder for project ${projectId}`);

      const framework = await detectFramework(projectPath);
      await buildProject(projectId, framework);
      console.log(`Built project ${projectId} with ${framework} framework`);

      await dockerizeProject(projectId, framework);
      console.log(`Dockerized and pushed image for project ${projectId}`);

      await publisher.hSet("status", projectId, "deployed");
      await updateStatus(projectId, "deployed", `Deployment completed with ${framework} framework`);
      console.log(`Project ${projectId} deployed successfully`);

    } catch (error: any) {
      console.error(`Build failed for project ${response?.element}:`, error);
      const projectId = response?.element;
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
  console.error("Main loop error:", err);
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