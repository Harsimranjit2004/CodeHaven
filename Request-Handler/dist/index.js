"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const node_fetch_1 = __importDefault(require("node-fetch"));
const dockerode_1 = __importDefault(require("dockerode"));
const child_process_1 = require("child_process");
const http_proxy_middleware_1 = require("http-proxy-middleware");
// Debug logging
console.log("Config:", config_1.config);
const app = (0, express_1.default)();
const docker = new dockerode_1.default();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// In-memory store for project data (replace with a database for persistence)
const projectData = new Map();
let nextPort = 8086; // Starting port for dynamic allocation
// Docker Hub credentials
const DOCKER_REGISTRY = "docker.io"; // Default Docker Hub registry
const DOCKER_USERNAME = "harsimranjit2004"; // Hardcoded username
const DOCKER_PASSWORD = "Simran@25062"; // Hardcoded for now (not secure for production)
// Check Docker daemon status
function checkDockerDaemon() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const dockerInfo = (0, child_process_1.spawn)("docker", ["info"]);
            dockerInfo.stdout.on("data", (data) => console.log(`Docker info: ${data.toString()}`));
            dockerInfo.stderr.on("data", (data) => console.error(`Docker error: ${data.toString()}`));
            dockerInfo.on("close", (code) => {
                if (code === 0) {
                    console.log("Docker daemon is running");
                    resolve(true);
                }
                else {
                    console.error("Docker daemon is not running");
                    reject(new Error("Docker daemon is not running"));
                }
            });
            dockerInfo.on("error", (err) => {
                console.error(`Error checking Docker daemon: ${err.message}`);
                reject(err);
            });
        });
    });
}
// Ensure Docker daemon is running
function ensureDockerDaemon() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield checkDockerDaemon();
            return true;
        }
        catch (error) {
            console.error("Docker daemon check failed. Please start Docker Desktop manually.", error.message);
            throw error;
        }
    });
}
// Docker Hub login
function dockerLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            console.log(`Logging into Docker registry ${DOCKER_REGISTRY}...`);
            const login = (0, child_process_1.spawn)("docker", ["login", "-u", DOCKER_USERNAME, "--password-stdin", DOCKER_REGISTRY], {
                stdio: ["pipe", "pipe", "pipe"],
            });
            let loginOutput = "";
            let loginError = "";
            login.stdin.write(DOCKER_PASSWORD + "\n");
            login.stdin.end();
            login.stdout.on("data", (data) => {
                loginOutput += data.toString();
                console.log(`Login stdout: ${data.toString()}`);
            });
            login.stderr.on("data", (data) => {
                loginError += data.toString();
                console.error(`Login stderr: ${data.toString()}`);
            });
            login.on("close", (code) => {
                if (code === 0) {
                    console.log("Docker login successful:", loginOutput);
                    resolve(true);
                }
                else {
                    console.error("Docker login failed:", loginError);
                    reject(new Error(`Docker login failed: ${loginError}`));
                }
            });
            login.on("error", (err) => {
                console.error(`Error during Docker login: ${err.message}`);
                reject(err);
            });
        });
    });
}
// Function to get Docker Hub authentication token (for API requests)
function getDockerToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, node_fetch_1.default)("https://hub.docker.com/v2/users/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: DOCKER_USERNAME, password: DOCKER_PASSWORD }),
        });
        const data = yield response.json();
        if (!data.token)
            throw new Error("Failed to get Docker Hub token");
        return data.token;
    });
}
// Function to delete image from Docker Hub
function deleteImageFromDockerHub(imageName_1) {
    return __awaiter(this, arguments, void 0, function* (imageName, tag = "latest") {
        try {
            yield ensureDockerDaemon();
            yield dockerLogin();
            const token = yield getDockerToken();
            const response = yield (0, node_fetch_1.default)(`https://hub.docker.com/v2/repositories/${config_1.config.docker.username}/${imageName}/tags/${tag}/`, {
                method: "DELETE",
                headers: { Authorization: `JWT ${token}` },
            });
            if (response.status === 204) {
                console.log(`Deleted image ${config_1.config.docker.username}/${imageName}:${tag} due to inactivity`);
            }
            else if (response.status === 404) {
                console.log(`Image ${config_1.config.docker.username}/${imageName}:${tag} not found`);
            }
            else {
                console.error(`Failed to delete image ${config_1.config.docker.username}/${imageName}:${tag}, status: ${response.status}`);
            }
        }
        catch (error) {
            console.error(`Error deleting image from Docker Hub: ${error.message}`);
        }
    });
}
// Function to deploy a container (shared logic for /deploy and global route)
function deployContainer(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullImageName = `${config_1.config.docker.username}/${projectId}`;
        console.log(`Attempting to pull image: ${fullImageName}`); // Debug log
        try {
            yield ensureDockerDaemon();
            yield dockerLogin();
            if (!projectData.has(projectId)) {
                projectData.set(projectId, { envVars: {}, lastActivity: new Date(), port: null, containerId: null });
            }
            const project = projectData.get(projectId);
            project.lastActivity = new Date();
            if (project.containerId) {
                const container = docker.getContainer(project.containerId);
                const containerInfo = yield container.inspect();
                if (containerInfo.State.Running) {
                    return { url: `http://${projectId}.${config_1.config.domain}` };
                }
            }
            const stream = yield docker.pull(fullImageName);
            yield new Promise((resolve, reject) => {
                docker.modem.followProgress(stream, (err, output) => {
                    if (err)
                        return reject(err);
                    resolve(output);
                });
            });
            const hostPort = project.port || nextPort++;
            project.port = hostPort;
            const envVars = Object.entries(project.envVars).map(([key, value]) => `${key}=${value}`);
            const container = yield docker.createContainer({
                Image: fullImageName,
                ExposedPorts: { "3000/tcp": {} }, // Matches the container's port
                HostConfig: {
                    PortBindings: { "3000/tcp": [{ HostPort: hostPort.toString() }] },
                },
                Env: envVars,
            });
            yield container.start();
            console.log(`Container started for ${projectId} on port ${hostPort}. Waiting for it to initialize...`);
            yield new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
            project.containerId = container.id;
            projectData.set(projectId, project);
            return { url: `http://${projectId}.${config_1.config.domain}` };
        }
        catch (error) {
            throw new Error(`Failed to deploy container for ${projectId}: ${error.message}`);
        }
    });
}
// Route to set environment variables for a project
app.post("/set-env/:projectId", (req, res) => {
    const projectId = req.params.projectId;
    const { envVars } = req.body;
    if (!envVars || typeof envVars !== "object") {
        return res.status(400).send({ error: "Invalid environment variables" });
    }
    if (!projectData.has(projectId)) {
        projectData.set(projectId, { envVars: {}, lastActivity: new Date(), port: null, containerId: null });
    }
    const project = projectData.get(projectId);
    project.envVars = Object.assign(Object.assign({}, project.envVars), envVars);
    project.lastActivity = new Date();
    res.send({ message: "Environment variables set", envVars: project.envVars });
});
// Route to explicitly deploy a container
app.get("/deploy/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    try {
        const result = yield deployContainer(projectId);
        res.send(result);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send({ error: error.message });
    }
}));
// Health check route for internal use
app.get("/health/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const project = projectData.get(projectId);
    if (!project || !project.containerId) {
        return res.status(404).send({ error: "Project not found or not deployed" });
    }
    try {
        yield ensureDockerDaemon();
        const container = docker.getContainer(project.containerId);
        const containerInfo = yield container.inspect();
        if (containerInfo.State.Running) {
            res.set("X-Port", project.port.toString()); // Custom header for proxy
            res.send({ status: "healthy", port: project.port });
        }
        else {
            res.status(503).send({ status: "unhealthy" });
        }
    }
    catch (error) {
        res.status(500).send({ error: "Failed to check container status" });
    }
}));
// Global route with automatic proxying
app.all("/*", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    const projectId = host.split(".")[0]; // e.g., "67d86021f21aa7363b18e463"
    // Validate domain structure
    if (!projectId || !host.endsWith(config_1.config.domain)) {
        return res.status(400).send({ error: `Invalid domain format. Expected <projectId>.${config_1.config.domain}` });
    }
    try {
        // Check if the project exists and the container is running
        let project = projectData.get(projectId);
        if (project && project.containerId) {
            const container = docker.getContainer(project.containerId);
            const containerInfo = yield container.inspect();
            if (containerInfo.State.Running) {
                // Proxy the request to the container
                const target = `http://localhost:${project.port}`;
                console.log(`Proxying to ${target}`); // Debug log
                const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
                    target,
                    changeOrigin: true,
                    pathRewrite: {
                        [`^/${projectId}`]: "",
                    },
                    on: {
                        proxyReq: (proxyReq, req, res) => {
                            proxyReq.setHeader("Host", req.hostname);
                        },
                        error: (err, req, res) => {
                            console.error(`Proxy error details: ${err.message}`);
                            res.status(502).send({ error: "Proxy error", message: err.message });
                        },
                    },
                });
                return proxy(req, res, next);
            }
        }
        // If container isn't running, deploy it
        const result = yield deployContainer(projectId);
        // Re-fetch the project after deployment to ensure it exists
        project = projectData.get(projectId);
        if (project) {
            project.lastActivity = new Date(); // Update last activity after deployment
        }
        else {
            console.error(`Project ${projectId} not found in projectData after deployment`);
        }
        const target = `http://localhost:${project.port}`;
        console.log(`Proxying to ${target}`); // Debug log
        const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
            target,
            changeOrigin: true,
            pathRewrite: {
                [`^/${projectId}`]: "",
            },
            on: {
                proxyReq: (proxyReq, req, res) => {
                    proxyReq.setHeader("Host", req.hostname);
                },
                error: (err, req, res) => {
                    console.error(`Proxy error details: ${err.message}`);
                    res.status(502).send({ error: "Proxy error", message: err.message });
                },
            },
        });
        proxy(req, res, next);
    }
    catch (error) {
        console.error(`Error handling request for ${projectId}:`, error.message);
        res.status(503).send({ error: "Service unavailable: Failed to deploy container" });
    }
}));
// Periodic job to clean up inactive projects and containers
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const inactivityThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const now = new Date();
    for (const [projectId, data] of projectData) {
        const inactivityTime = now.getTime() - data.lastActivity.getTime();
        if (inactivityTime > inactivityThreshold) {
            if (data.containerId) {
                const container = docker.getContainer(data.containerId);
                try {
                    yield container.stop();
                    yield container.remove();
                }
                catch (error) {
                    console.error(`Error cleaning up container for ${projectId}:`, error.message);
                }
            }
            yield deleteImageFromDockerHub(projectId);
            projectData.delete(projectId);
        }
    }
}), 24 * 60 * 60 * 1000); // Run every 24 hours
// Initial setup: Check Docker daemon and login on startup
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ensureDockerDaemon();
        yield dockerLogin();
        console.log("Server setup complete. Ready to handle requests.");
    }
    catch (error) {
        console.error("Failed to initialize server:", error.message);
        process.exit(1);
    }
}))();
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
