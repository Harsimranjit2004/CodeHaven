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
import axios from "axios"; // Make sure to import axios
require('dotenv').config()
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
async function getAccessTokenForUser(userId:any, provider:any) {
  const tokens = await clerkClient.users.getUserOauthAccessToken(userId, provider);
  if (tokens.length === 0) {
    throw new Error("No OAuth access token found for this provider");
  }
  return tokens[0].token;
}

// Endpoint to fetch GitHub repositories using the user's OAuth token.
app.get("/get_repos", async (req:any, res:any) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }
    
    // Retrieve the Clerk user (optional, for debugging)
    const user = await clerkClient.users.getUser(userId.toString());
    console.log("User retrieved:", user);

    // Retrieve the GitHub access token using our helper function.
    const provider = "oauth_github"; // Adjust based on your Clerk configuration.
    const accessToken = await getAccessTokenForUser(userId, provider);
    console.log("Access token:", accessToken);
    
    // Call GitHub's API to fetch the user's repositories.
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        "Authorization": `token ${accessToken}`,
        "Accept": "application/vnd.github.v3+json"
      },
      params: {
        visibility: "all",
        per_page: 100  // Adjust pagination as needed.
      }
    });
    
    res.json({ repos: response.data });
  } catch (error) {
    console.error("Error fetching GitHub repos:");
    res.status(500).json({ error: "Internal server error" });
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

// Start the backend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Using endpoint:", config.aws.endpoint);
});
