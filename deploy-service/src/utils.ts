// utils.js
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { uploadFile } from "./aws";
export function buildProject(id:any, framework:any) {
  return new Promise((resolve, reject) => {
    const projectPath = path.join(__dirname, `output/${id}`);
    let buildCommand;

    switch (framework.toLowerCase()) {
      case "react":
      case "next.js":
      case "vue":
        buildCommand = "npm install && npm run build";
        console.log("react + nextd.js + vue ")
        break;
      case "node.js":
        buildCommand = "npm install";
        console.log("node.js projects")
        break;
      case "static":
        buildCommand = "echo 'No build required for static site'";
        console.log("other static site")
        break;
      default:
        buildCommand = "npm install && npm run build";
        console.warn(`Unknown framework ${framework}, using default build command`);
    }

    const child = exec(`cd ${projectPath} && ${buildCommand}`, (error) => {
      if (error) {
        console.error(`Build error for ${id}:`, error);
        reject(error);
        return;
      }
      const outputFolder = getBuildOutputFolder(projectPath, framework);
      if (!fs.existsSync(outputFolder) && framework !== "node.js" && framework !== "static") {
        reject(new Error(`Build output folder ${outputFolder} not found for ${framework}`));
        return;
      }
      console.log("the output folder is " + outputFolder)
      resolve(outputFolder);
    });

    child.stdout?.on("data", (data) => console.log(`[${id}] stdout: ${data}`));
    child.stderr?.on("data", (data) => console.error(`[${id}] stderr: ${data}`));
  });
}
function getBuildOutputFolder(projectPath:any, framework:any) {
  const lowerFramework = framework.toLowerCase();

  // Helper to check if a folder exists
  const folderExists = (folder:any) => fs.existsSync(path.join(projectPath, folder));

  switch (lowerFramework) {
    case "react":
      // Check common React output folders
      if (folderExists("build")) return path.join(projectPath, "build"); // CRA default
      if (folderExists("dist")) return path.join(projectPath, "dist");   // Vite or custom
      // Try to infer from package.json or build tool config
      try {
        const packageJsonPath = path.join(projectPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
          const buildScript = packageJson.scripts?.build || "";
          // Look for clues in the build script
          if (buildScript.includes("react-scripts") && folderExists("build")) {
            return path.join(projectPath, "build");
          }
          if (buildScript.includes("vite") && folderExists("dist")) {
            return path.join(projectPath, "dist");
          }
          // Custom output (e.g., "build: webpack --output dist")
          const match = buildScript.match(/--output\s+(\S+)/);
          if (match && folderExists(match[1])) {
            return path.join(projectPath, match[1]);
          }
        }
      } catch (error) {
        console.warn(`Could not infer React output folder for ${projectPath}:`, error);
      }
      // Fallback to "build" if no clear indicator
      console.warn(`Defaulting to "build" for React project at ${projectPath}`);
      return path.join(projectPath, "build");

    case "next.js":
      const nextConfigPath = path.join(projectPath, "next.config.js");
      if (fs.existsSync(nextConfigPath) && fs.readFileSync(nextConfigPath, "utf-8").includes("output: 'export'")) {
        return path.join(projectPath, "out"); // Static export
      }
      return path.join(projectPath, ".next"); // SSR or default

    case "vue":
      return path.join(projectPath, "dist"); // Vue CLI default

    case "node.js":
    case "static":
      return projectPath; // No separate build folder

    default:
      console.warn(`Unknown framework ${framework}, defaulting to "build"`);
      return path.join(projectPath, "build");
  }
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

// export async function copyFinalDist(id: any, framework: any) {
//   const folderPath = path.join(__dirname, `output/${id}`);
//   let distPath;

//   switch (framework.toLowerCase()) {
//     case "next.js":
//     case "react":
//     case "vue":
//       distPath = path.join(folderPath, "build");
//       break;
//     case "node.js":
//       distPath = folderPath; // Node.js projects typically don't have a separate dist folder
//       break;
//     case "static":
//       distPath = folderPath;
//       break;
//     default:
//       distPath = path.join(folderPath, "build");
//   }

//   if (!fs.existsSync(distPath)) {
//     console.warn(`Dist folder not found for ${id} at ${distPath}`);
//     return;
//   }

//   const allFiles = getAllFilePaths(distPath);
//   await Promise.all(
//     allFiles.map((file: any) =>
//       uploadFile(`dist/${id}/` + file.slice(distPath.length + 1), file).catch((err: any) =>
//         console.error(`Failed to upload ${file}:`, err)
//       )
//     )
//   );
// }
export async function copyFinalDist(id:any, framework:any, distPath:any) {
  const folderPath = path.join(__dirname, `output/${id}`);

  if (!fs.existsSync(distPath)) {
    console.error(`Dist folder not found for ${id} at ${distPath}`);
    throw new Error(`Build output missing for ${framework}`);
  }

  const allFiles = getAllFilePaths(distPath);
  await Promise.all(
    allFiles.map((file) =>
      uploadFile(`dist/${id}/` + file.slice(distPath.length + 1), file).catch((err) =>
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