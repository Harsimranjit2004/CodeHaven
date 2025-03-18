import express from "express";
import { config } from "./config";
import fetch from "node-fetch";
import Docker from "dockerode";
import { spawn } from "child_process";
import { createProxyMiddleware } from "http-proxy-middleware";

// Debug logging
console.log("Config:", config);

const app: any = express();
const docker: any = new Docker();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for project data (replace with a database for persistence)
const projectData: any = new Map();
let nextPort: any = 8086 ; // Starting port for dynamic allocation

// Docker Hub credentials
const DOCKER_REGISTRY: any = "docker.io"; // Default Docker Hub registry
const DOCKER_USERNAME: any = "harsimranjit2004"; // Hardcoded username
const DOCKER_PASSWORD: any = "" // Hardcoded for now (not secure for production)

// Check Docker daemon status
async function checkDockerDaemon(): Promise<any> {
  return new Promise((resolve, reject) => {
    const dockerInfo: any = spawn("docker", ["info"]);

    dockerInfo.stdout.on("data", (data: any) => console.log(`Docker info: ${data.toString()}`));
    dockerInfo.stderr.on("data", (data: any) => console.error(`Docker error: ${data.toString()}`));

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

// Ensure Docker daemon is running
async function ensureDockerDaemon(): Promise<any> {
  try {
    await checkDockerDaemon();
    return true;
  } catch (error: any) {
    console.error("Docker daemon check failed. Please start Docker Desktop manually.", error.message);
    throw error;
  }
}

// Docker Hub login
async function dockerLogin(): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log(`Logging into Docker registry ${DOCKER_REGISTRY}...`);
    const login: any = spawn("docker", ["login", "-u", DOCKER_USERNAME, "--password-stdin", DOCKER_REGISTRY], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let loginOutput: any = "";
    let loginError: any = "";

    login.stdin.write(DOCKER_PASSWORD + "\n");
    login.stdin.end();

    login.stdout.on("data", (data: any) => {
      loginOutput += data.toString();
      console.log(`Login stdout: ${data.toString()}`);
    });

    login.stderr.on("data", (data: any) => {
      loginError += data.toString();
      console.error(`Login stderr: ${data.toString()}`);
    });

    login.on("close", (code: any) => {
      if (code === 0) {
        console.log("Docker login successful:", loginOutput);
        resolve(true);
      } else {
        console.error("Docker login failed:", loginError);
        reject(new Error(`Docker login failed: ${loginError}`));
      }
    });

    login.on("error", (err: any) => {
      console.error(`Error during Docker login: ${err.message}`);
      reject(err);
    });
  });
}

// Function to get Docker Hub authentication token (for API requests)
async function getDockerToken(): Promise<any> {
  const response: any = await fetch("https://hub.docker.com/v2/users/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: DOCKER_USERNAME, password: DOCKER_PASSWORD }),
  });
  const data: any = await response.json();
  if (!data.token) throw new Error("Failed to get Docker Hub token");
  return data.token;
}

// Function to delete image from Docker Hub
async function deleteImageFromDockerHub(imageName: any, tag: any = "latest"): Promise<void> {
  try {
    await ensureDockerDaemon();
    await dockerLogin();

    const token: any = await getDockerToken();
    const response: any = await fetch(
      `https://hub.docker.com/v2/repositories/${config.docker.username}/${imageName}/tags/${tag}/`,
      {
        method: "DELETE",
        headers: { Authorization: `JWT ${token}` },
      }
    );
    if (response.status === 204) {
      console.log(`Deleted image ${config.docker.username}/${imageName}:${tag} due to inactivity`);
    } else if (response.status === 404) {
      console.log(`Image ${config.docker.username}/${imageName}:${tag} not found`);
    } else {
      console.error(`Failed to delete image ${config.docker.username}/${imageName}:${tag}, status: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error deleting image from Docker Hub: ${error.message}`);
  }
}

// Function to deploy a container (shared logic for /deploy and global route)
async function deployContainer(projectId: any): Promise<any> {
  const fullImageName: any = `${config.docker.username}/${projectId}`;
  console.log(`Attempting to pull image: ${fullImageName}`); // Debug log

  try {
    await ensureDockerDaemon();
    await dockerLogin();

    if (!projectData.has(projectId)) {
      projectData.set(projectId, { envVars: {}, lastActivity: new Date(), port: null, containerId: null });
    }

    const project: any = projectData.get(projectId);
    project.lastActivity = new Date();

    if (project.containerId) {
      const container: any = docker.getContainer(project.containerId);
      const containerInfo: any = await container.inspect();
      if (containerInfo.State.Running) {
        return { url: `http://${projectId}.${config.domain}` };
      }
    }

    const stream: any = await docker.pull(fullImageName);
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err: any, output: any) => {
        if (err) return reject(err);
        resolve(output);
      });
    });

    const hostPort: any = project.port || nextPort++;
    project.port = hostPort;

    const envVars: any = Object.entries(project.envVars).map(([key, value]) => `${key}=${value}`);

    const container: any = await docker.createContainer({
      Image: fullImageName,
      ExposedPorts: { "3000/tcp": {} }, // Matches the container's port
      HostConfig: {
        PortBindings: { "3000/tcp": [{ HostPort: hostPort.toString() }] },
      },
      Env: envVars,
    });

    await container.start();
    console.log(`Container started for ${projectId} on port ${hostPort}. Waiting for it to initialize...`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    project.containerId = container.id;
    projectData.set(projectId, project);

    return { url: `http://${projectId}.${config.domain}` };
  } catch (error: any) {
    throw new Error(`Failed to deploy container for ${projectId}: ${error.message}`);
  }
}

// Route to set environment variables for a project
app.post("/set-env/:projectId", (req: any, res: any) => {
  const projectId: any = req.params.projectId;
  const { envVars } = req.body;

  if (!envVars || typeof envVars !== "object") {
    return res.status(400).send({ error: "Invalid environment variables" });
  }

  if (!projectData.has(projectId)) {
    projectData.set(projectId, { envVars: {}, lastActivity: new Date(), port: null, containerId: null });
  }
  const project: any = projectData.get(projectId);
  project.envVars = { ...project.envVars, ...envVars };
  project.lastActivity = new Date();

  res.send({ message: "Environment variables set", envVars: project.envVars });
});

// Route to explicitly deploy a container
app.get("/deploy/:projectId", async (req: any, res: any) => {
  const projectId: any = req.params.projectId;

  try {
    const result = await deployContainer(projectId);
    res.send(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Health check route for internal use
app.get("/health/:projectId", async (req: any, res: any) => {
  const projectId: any = req.params.projectId;
  const project = projectData.get(projectId);

  if (!project || !project.containerId) {
    return res.status(404).send({ error: "Project not found or not deployed" });
  }

  try {
    await ensureDockerDaemon();
    const container: any = docker.getContainer(project.containerId);
    const containerInfo: any = await container.inspect();
    if (containerInfo.State.Running) {
      res.set("X-Port", project.port.toString()); // Custom header for proxy
      res.send({ status: "healthy", port: project.port });
    } else {
      res.status(503).send({ status: "unhealthy" });
    }
  } catch (error: any) {
    res.status(500).send({ error: "Failed to check container status" });
  }
});

// Global route with automatic proxying
app.all("/*", async (req: any, res: any, next: any) => {
  const host: any = req.hostname;
  const projectId: any = host.split(".")[0]; // e.g., "67d86021f21aa7363b18e463"

  // Validate domain structure
  if (!projectId || !host.endsWith(config.domain)) {
    return res.status(400).send({ error: `Invalid domain format. Expected <projectId>.${config.domain}` });
  }

  try {
    // Check if the project exists and the container is running
    let project = projectData.get(projectId);
    if (project && project.containerId) {
      const container: any = docker.getContainer(project.containerId);
      const containerInfo: any = await container.inspect();
      if (containerInfo.State.Running) {
        // Proxy the request to the container
        const target = `http://localhost:${project.port}`;
        console.log(`Proxying to ${target}`); // Debug log
        const proxy = createProxyMiddleware({
          target,
          changeOrigin: true,
          pathRewrite: {
            [`^/${projectId}`]: "",
          },
          on: {
            proxyReq: (proxyReq: any, req: any, res: any) => {
              proxyReq.setHeader("Host", req.hostname);
            },
            error: (err: any, req: any, res: any) => {
              console.error(`Proxy error details: ${err.message}`);
              res.status(502).send({ error: "Proxy error", message: err.message });
            },
          },
        });
        return proxy(req, res, next);
      }
    }

    // If container isn't running, deploy it
    const result = await deployContainer(projectId);
    // Re-fetch the project after deployment to ensure it exists
    project = projectData.get(projectId);
    if (project) {
      project.lastActivity = new Date(); // Update last activity after deployment
    } else {
      console.error(`Project ${projectId} not found in projectData after deployment`);
    }
    const target = `http://localhost:${project.port}`;
    console.log(`Proxying to ${target}`); // Debug log
    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^/${projectId}`]: "",
      },
      on: {
        proxyReq: (proxyReq: any, req: any, res: any) => {
          proxyReq.setHeader("Host", req.hostname);
        },
        error: (err: any, req: any, res: any) => {
          console.error(`Proxy error details: ${err.message}`);
          res.status(502).send({ error: "Proxy error", message: err.message });
        },
      },
    });
    proxy(req, res, next);
  } catch (error: any) {
    console.error(`Error handling request for ${projectId}:`, error.message);
    res.status(503).send({ error: "Service unavailable: Failed to deploy container" });
  }
});

// Periodic job to clean up inactive projects and containers
setInterval(async () => {
  const inactivityThreshold: any = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const now: any = new Date();
  for (const [projectId, data] of projectData) {
    const inactivityTime: any = now.getTime() - data.lastActivity.getTime();
    if (inactivityTime > inactivityThreshold) {
      if (data.containerId) {
        const container: any = docker.getContainer(data.containerId);
        try {
          await container.stop();
          await container.remove();
        } catch (error: any) {
          console.error(`Error cleaning up container for ${projectId}:`, error.message);
        }
      }
      await deleteImageFromDockerHub(projectId);
      projectData.delete(projectId);
    }
  }
}, 24 * 60 * 60 * 1000); // Run every 24 hours

// Initial setup: Check Docker daemon and login on startup
(async () => {
  try {
    await ensureDockerDaemon();
    await dockerLogin();
    console.log("Server setup complete. Ready to handle requests.");
  } catch (error: any) {
    console.error("Failed to initialize server:", error.message);
    process.exit(1);
  }
})();

app.listen(3001, () => {
  console.log("Server running on port 3001");
});