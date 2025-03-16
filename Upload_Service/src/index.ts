import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generateCustomId } from "./utils";
import { getAllFilePaths } from "./file";
import path from "path";
import fs from "fs/promises";
import { uploadFile } from "./aws";
import { createClient } from "redis";
import { config } from "./config";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import http from "http";
import { Server, Socket } from "socket.io";
import { ObjectId } from "mongodb"; // Import ObjectId for MongoDB

require("dotenv").config();

// Initialize Prisma Client for MongoDB
const prisma = new PrismaClient();
async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB via Prisma");
  } catch (err) {
    console.error("Prisma connection error:", err);
    process.exit(1);
  }
}
connectPrisma();

// Redis setup
const subscriber = createClient({ url: config.redis.url });
subscriber.connect().catch((err) => console.error("Redis subscriber connection error:", err));

const publisher = createClient({ url: config.redis.url });
publisher.connect().catch((err) => console.error("Redis publisher connection error:", err));

// Express setup with WebSocket
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("subscribe", (projectId) => {
    socket.join(projectId);
    console.log(`Client ${socket.id} subscribed to project ${projectId}`);
  });
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// Helper function to get OAuth access token
async function getAccessTokenForUser(userId:any, provider:any) {
  try {
    const tokens = await clerkClient.users.getUserOauthAccessToken(userId, provider);
    if (tokens.length === 0) {
      throw new Error("No OAuth access token found for this provider");
    }
    return tokens[0].token;
  } catch (error) {
    console.error(`Failed to get access token for user ${userId}:`, error);
    throw error;
  }
}

// Helper function to get user details
async function getUserDetails(userId:any) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      email: user.emailAddresses[0]?.emailAddress || "unknown@email.com",
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",
    };
  } catch (error) {
    console.error(`Failed to get user details for user ${userId}:`, error);
    return { email: "unknown@email.com", name: "Unknown User" };
  }
}

// Function to clean up temporary directory
async function cleanupTempDir(projectPath:any) {
  try {
    await fs.rm(projectPath, { recursive: true, force: true });
    console.log(`Cleaned up temporary directory: ${projectPath}`);
  } catch (error) {
    console.error(`Failed to clean up directory ${projectPath}:`, error);
  }
}

// Deploy endpoint
app.post("/deploy", async (req:any, res:any) => {
  const { repoUrl, projectName, envVars = [], userId } = req.body;

  // Input validation
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!projectName || typeof projectName !== "string" || projectName.trim().length === 0) {
    return res.status(400).json({ error: "Project name is required" });
  }
  if (!repoUrl || typeof repoUrl !== "string" || !repoUrl.includes("github.com")) {
    return res.status(400).json({ error: "Valid GitHub repository URL is required" });
  }
  if (!Array.isArray(envVars)) {
    return res.status(400).json({ error: "envVars must be an array" });
  }

  // Generate a valid MongoDB ObjectId
  const projectId = new ObjectId().toString(); // Generate a valid 24-character hex string
  const projectPath = path.join(__dirname, `output/${projectId}`);

  try {
    // Emit initial status
    io.to(projectId).emit("status-update", {
      projectId,
      status: "starting",
      message: "Starting deployment process...",
    });
    console.log(`Starting deployment for project ${projectId} by user ${userId}`);

    // Get GitHub access token for authenticated cloning
    const accessToken = await getAccessTokenForUser(userId, "oauth_github");

    // Get user details from Clerk
    const userDetails = await getUserDetails(userId);

    // Configure simple-git with authentication
    const git = simpleGit().env({
      ...process.env,
      GIT_TOKEN: accessToken,
    });

    // Clone repository with authentication
    io.to(projectId).emit("status-update", {
      projectId,
      status: "cloning",
      message: "Cloning repository...",
    });
    console.log(`Cloning repository ${repoUrl} for project ${projectId}`);
    await git.clone(repoUrl, projectPath, ["--depth", "1"]);
    const filePaths = await getAllFilePaths(projectPath);

    // Upload files to AWS S3
    io.to(projectId).emit("status-update", {
      projectId,
      status: "uploading",
      message: "Uploading files to S3...",
    });
    for (const file of filePaths) {
      try {
        await uploadFile(file.slice(__dirname.length + 1), file);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }

    // Generate a preview domain
    const domain = `${projectId}-preview.yourdomain.com`;

    // Save project to MongoDB with Prisma
    const project = await prisma.project.create({
      data: {
        id: projectId, // Use the valid ObjectId
        userId,
        userEmail: userDetails.email,
        userName: userDetails.name,
        name: projectName.trim(),
        repoUrl,
        envVars,
        s3Files: [], // S3 file metadata not tracked with current upload logic
        framework: "Unknown", // Framework detection not implemented here
        lastDeployed: new Date(),
        domain,
        status: "uploading",
      },
    });
    console.log(`Project ${projectId} saved to MongoDB for user ${userId}`);

    // Add to build queue and update status
    io.to(projectId).emit("status-update", {
      projectId,
      status: "uploaded",
      message: "Files uploaded, queuing build...",
    });
    await publisher.lPush("build-queue", projectId);
    await publisher.hSet("status", projectId, "uploaded");
    console.log(`Project ${projectId} added to build queue`);

    // Log the deployment start
    await prisma.log.create({
      data: {
        projectId,
        userId,
        status: "uploaded",
        message: "Files uploaded, build process queued",
      },
    });
    console.log(`Deployment log created for project ${projectId}`);

    res.status(201).json({
      id: projectId,
      s3Files: [],
      framework: "Unknown",
      userEmail: userDetails.email,
      userName: userDetails.name,
      domain,
      message: "Files uploaded successfully, build process queued",
    });
  } catch (error) {
    console.error(`Deployment failed for project ${projectId}:`, error);
    io.to(projectId).emit("status-update", {
      projectId,
      status: "failed",
      message: `Deployment failed:  "Unknown error"}`,
    });
    await cleanupTempDir(projectPath);
    res.status(500).json({ error:   "Deployment failed" });
  } finally {
    await cleanupTempDir(projectPath);
  }
});

// Endpoint to fetch GitHub repositories
app.get("/get_repos", async (req:any, res:any) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing user ID" });
    }

    // Retrieve the GitHub access token
    const provider = "oauth_github";
    const accessToken = await getAccessTokenForUser(userId, provider);
    console.log("Access token retrieved for user:", userId);

    // Call GitHub's API to fetch the user's repositories
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        visibility: "all",
        per_page: 100,
      },
    });

    // Map the response to a simpler format for the frontend
    const repos = response.data.map((repo:any) => ({
      name: repo.name,
      fullName: repo.full_name,
      url: repo.clone_url,
      defaultBranch: repo.default_branch,
      private: repo.private,
    }));
    console.log("Repositories fetched:", repos);
    res.json({ repos });
  } catch (error) {
    console.error("Error fetching GitHub repos:", );
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

// Status endpoint
app.get("/status", async (req:any, res:any) => {
  try {
    const id = req.query.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Project ID is required" });
    }
    const status = await subscriber.hGet("status", id);
    res.json({ status: status || "unknown" });
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});
// In upload-service.js
app.post("/update-status", async (req:any, res:any) => {
  const { projectId, status, message, userId } = req.body;

  if (!projectId || !status) {
    return res.status(400).json({ error: "projectId and status are required" });
  }

  try {
    // Update the project status
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status, lastDeployed: status === "deployed" ? new Date() : undefined },
    });

    // Create a log entry
    await prisma.log.create({
      data: {
        projectId,
        userId: userId || project.userId,
        status,
        message: message || `Deployment status updated to ${status}`,
      },
    });

    // Emit WebSocket update (already set up in upload-service)
    io.to(projectId).emit("status-update", { projectId, status, message });

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(`Error updating status for project ${projectId}:`, error);
    res.status(500).json({ error: "Failed to update status" });
  }
});
// Add this endpoint to upload-service.js
app.get("/projects", async (req:any, res:any) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { lastDeployed: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Optional: Add a delete endpoint for the frontend delete action
app.delete("/project/:id", async (req:any, res:any) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found or unauthorized" });
    }

    await prisma.project.delete({ where: { id } });
    await publisher.hDel("status", id); // Clean up Redis status
    io.to(id).emit("status-update", { projectId: id, status: "deleted", message: "Project deleted" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});
// Start the backend server with WebSocket
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Upload Service running on port ${PORT} at ${new Date().toISOString()}`);
  console.log("Using endpoint:", config.aws.endpoint);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  prisma.$disconnect().catch(() => {});
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  prisma.$disconnect().catch(() => {});
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await prisma.$disconnect();
  await subscriber.quit();
  await publisher.quit();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await prisma.$disconnect();
  await subscriber.quit();
  await publisher.quit();
  process.exit(0);
});