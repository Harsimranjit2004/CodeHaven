// deploy-service.js
import { createClient, commandOptions } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject, detectFramework } from "./utils"; // Removed copyFinalDist
import axios from "axios";
import path from "path";
import fs from "fs/promises";
require("dotenv").config();

console.log("Starting deploy-service...");

const DOCKER_REGISTRY = process.env.DOCKER_REGISTRY || "docker.io";
const DOCKER_USERNAME = process.env.DOCKER_USERNAME || "your-username";
const DOCKER_PASSWORD = process.env.DOCKER_PASSWORD;

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

async function dockerizeProject(projectId: any, framework: any) {
  const projectPath = path.join(__dirname, `output/${projectId}`);
  const dockerfilePath = path.join(projectPath, "Dockerfile");
  const imageName = `${DOCKER_USERNAME}/${projectId}:latest`;

  let dockerfileContent = "";
  switch (framework.toLowerCase()) {
    case "next.js":
    case "react":
      dockerfileContent = `
        FROM node:16
        WORKDIR /app
        COPY . /app
        RUN npm install
        RUN npm run build
        CMD ["npx", "serve", "-s", "build", "-l", "8080"]
        EXPOSE 8080
      `;
      break;
    case "node.js":
      dockerfileContent = `
        FROM node:16
        WORKDIR /app
        COPY . /app
        RUN npm install
        CMD ["node", "server.js"]
        EXPOSE 8080
      `;
      break;
    case "vue":
      dockerfileContent = `
        FROM node:16
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
        COPY . /usr/share/nginx/html
        EXPOSE 80
      `;
      break;
    default:
      dockerfileContent = `
        FROM node:16
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

  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
    const loginCommand = `echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin ${DOCKER_REGISTRY}`;

    exec(loginCommand, (error: any) => {
      if (error) {
        console.error(`Docker login failed:`, error);
        reject(error);
        return;
      }

      exec(`cd ${projectPath} && docker build -t ${imageName} .`, (error: any) => {
        if (error) {
          console.error(`Docker build failed for ${projectId}:`, error);
          reject(error);
          return;
        }

        exec(`docker push ${imageName}`, (error: any) => {
          if (error) {
            console.error(`Docker push failed for ${projectId}:`, error);
            reject(error);
            return;
          }
          console.log(`Docker image ${imageName} pushed to registry`);
          resolve("");
        });
      });
    });
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

      // Removed copyFinalDist step
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