// server.js
import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generateCustomId } from "./utils";
import { getAllFilePaths } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";
import { config } from "./config";
import { clerkClient } from "@clerk/clerk-sdk-node";
// import fetch from "node-fetch"; // Use node-fetch v2 for CommonJS support
// import { Request, Response } from "express";
import { handleOAuthSignIn } from "./webHookHandler";
// Redis setup
const subscriber = createClient();
subscriber.connect();

const publisher = createClient({
  url: config.redis.url
});
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());



// Deploy endpoint (existing)
app.post("/deploy", async (req, res) => {
  try {
    const repoUrl = req.body.repoUrl;
    const id = generateCustomId();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
    const filePaths = await getAllFilePaths(path.join(__dirname, `output/${id}`));

    // Process files with error handling
    for (const file of filePaths) {
      try {
        await uploadFile(file.slice(__dirname.length + 1), file);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }

    await publisher.lPush("build-queue", id);
    await publisher.hSet("status", id, "uploaded");
    res.json({ id: id });
  } catch (error) {
    console.error("Deploy error:", error);
    res.status(500).json({ error: "Deployment failed" });
  }
});

// Status endpoint (existing)
app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response
  });
});
app.get('/getRepos', async (req, res)=>{
  const userId = req.query.userId
  console.log(userId)
})

app.post("/webhook/clerk", async (req, res) => {
  try {
    const event = req.body; // The webhook payload from Clerk

    // Check the event type; for example, process user.created or user.updated events
    if (event.type === "user.created" || event.type === "user.updated") {
      await handleOAuthSignIn(event);
    }
    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/api/github/repos', async (req: any, res: any) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      res.status(400).json({ error: "User ID required" });
      return;
    }

    // Retrieve user data from Clerk (this uses your Clerk secret key)
    const user = await clerkClient.users.getUser(userId as string);
    const token = user.publicMetadata.githubToken; // or privateMetadata if stored there

    if (!token) {
      res.status(400).json({ error: "GitHub token not found for this user" });
      return;
    }

    // Fetch repositories from GitHub using the access token
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: "Error fetching repos from GitHub" });
      return;
    }

    const repos = await response.json();
    res.json(repos);
  } catch (error) {
    console.error("Error in /api/github/repos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  })


// Start the backend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Using endpoint:", config.aws.endpoint);
});
