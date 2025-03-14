// utils.js
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { uploadFile } from "./aws";

export function buildProject(id: any, framework: any) {
  return new Promise((resolve, reject) => {
    const projectPath = path.join(__dirname, `output/${id}`);
    let buildCommand;

    switch (framework.toLowerCase()) {
      case "next.js":
      case "react":
      case "vue":
        buildCommand = "npm install && npm run build";
        break;
      case "node.js":
        buildCommand = "npm install"; // Only install dependencies, no need to run the app
        break;
      case "static":
        buildCommand = "echo 'No build required for static site'";
        break;
      default:
        buildCommand = "npm install && npm run build";
        console.warn(`Unknown framework ${framework}, using default build command`);
    }

    const child = exec(`cd ${projectPath} && ${buildCommand}`, (error: any) => {
      if (error) {
        console.error(`Build error for ${id}:`, error);
        reject(error);
        return;
      }
      resolve("");
    });

    child.stdout?.on("data", (data: any) => console.log(`[${id}] stdout: ${data}`));
    child.stderr?.on("data", (data: any) => console.error(`[${id}] stderr: ${data}`));
  });
}

export async function detectFramework(projectPath: any) {
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    await fs.promises.access(packageJsonPath);
    const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, "utf-8"));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (dependencies.next) return "Next.js";
    if (dependencies["react"] && dependencies["react-dom"]) return "React";
    if (dependencies.express) return "Node.js";
    if (dependencies.vue) return "Vue";
    if (packageJson.scripts?.start?.includes("node")) return "Node.js";
    return "Static";
  } catch (error: any) {
    console.warn(`Framework detection failed for ${projectPath}:`, error);
    return "Unknown";
  }
}

export async function copyFinalDist(id: any, framework: any) {
  const folderPath = path.join(__dirname, `output/${id}`);
  let distPath;

  switch (framework.toLowerCase()) {
    case "next.js":
    case "react":
    case "vue":
      distPath = path.join(folderPath, "build");
      break;
    case "node.js":
      distPath = folderPath; // Node.js projects typically don't have a separate dist folder
      break;
    case "static":
      distPath = folderPath;
      break;
    default:
      distPath = path.join(folderPath, "build");
  }

  if (!fs.existsSync(distPath)) {
    console.warn(`Dist folder not found for ${id} at ${distPath}`);
    return;
  }

  const allFiles = getAllFilePaths(distPath);
  await Promise.all(
    allFiles.map((file: any) =>
      uploadFile(`dist/${id}/` + file.slice(distPath.length + 1), file).catch((err: any) =>
        console.error(`Failed to upload ${file}:`, err)
      )
    )
  );
}

export function getAllFilePaths(folderPath: any) {
  let response: any[] = [];
  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file: any) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFilePaths(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
}