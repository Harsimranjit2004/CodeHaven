// // import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {  Code, Folder, Settings, Play, ChevronDown, ChevronUp, Plus, ArrowLeft } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import { GitHubLogoIcon } from "@radix-ui/react-icons";
// // const NewDeployment = () => {
// //   const navigate = useNavigate();
// //   const [projectName, setProjectName] = useState("code-haven");
// //   const [rootDirectory, setRootDirectory] = useState("/");
// //   const [isDeploying, setIsDeploying] = useState(false);
// //   const [buildSettingsOpen, setBuildSettingsOpen] = useState(false);
// //   const [envVarsOpen, setEnvVarsOpen] = useState(true); // Open by default to match the screenshot
// //   const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);

// //   const handleDeploy = () => {
// //     setIsDeploying(true);
// //     setTimeout(() => {
// //       alert("Deployment completed successfully!");
// //       setIsDeploying(false);
// //       navigate("/");
// //     }, 3000);
// //   };

// //   const addEnvVar = () => {
// //     setEnvVars([...envVars, { key: "", value: "" }]);
// //   };

// //   const updateEnvVar = (index, field, value) => {
// //     const newEnvVars = [...envVars];
// //     newEnvVars[index][field] = value;
// //     setEnvVars(newEnvVars);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-sans dark:from-gray-950 dark:to-gray-900 dark:text-white">
// //       {/* Header with Back Button */}
// //       <header className="p-4 flex items-center space-x-3">
// //         <motion.button
// //           whileHover={{ scale: 1.05 }}
// //           whileTap={{ scale: 0.95 }}
// //           onClick={() => navigate("/")}
// //           className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all"
// //         >
// //           <ArrowLeft className="h-5 w-5" />
// //           <span>Back to Dashboard</span>
// //         </motion.button>
// //       </header>

// //       {/* Main Content */}
// //       <main className="flex items-center justify-center px-4 py-8">
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6, ease: "easeOut" }}
// //           className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-2xl p-8 w-full max-w-4xl shadow-2xl dark:bg-gray-800/30 dark:border-gray-600/50"
// //         >
// //           <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-400 dark:to-indigo-500">
// //             New Project
// //           </h1>

// //           {/* Import from GitHub Section */}
// //           <div className="mb-6">
// //             <div className="flex items-center space-x-3 mb-3">
// //               <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
// //                 <GitHubLogoIcon className="h-5 w-5 text-gray-400" />
// //               </motion.div>
// //               <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Import from GitHub</h2>
// //             </div>
// //             <p className="text-gray-400 text-sm mb-2 dark:text-gray-400">
// //               harsimranjit2004/CodeHaven - main
// //             </p>
// //             <p className="text-gray-500 text-sm dark:text-gray-500">
// //               Choose where you want to create the project & give it a name.
// //             </p>
// //           </div>

// //           {/* Project Name Section */}
// //           <div className="mb-6">
// //             <div className="flex items-center space-x-3 mb-3">
// //               <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
// //                 <Code className="h-5 w-5 text-gray-400" />
// //               </motion.div>
// //               <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Project Name</h2>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <input
// //                 type="text"
// //                 value={projectName}
// //                 onChange={(e) => setProjectName(e.target.value)}
// //                 className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
// //                 placeholder="e.g., harsimranjit2004's project (Hobby)"
// //               />
// //               <span className="w-1/2 text-gray-400 text-sm">{projectName}</span>
// //             </div>
// //           </div>

// //           {/* Framework Preset Section */}
// //           <div className="mb-6">
// //             <div className="flex items-center space-x-3 mb-3">
// //               <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
// //                 <Code className="h-5 w-5 text-gray-400" />
// //               </motion.div>
// //               <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Framework Preset</h2>
// //             </div>
// //             <select
// //               className="w-full bg-gray-700/20 border border-gray-600/50 text-white appearance-none rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white"
// //             >
// //               <option value="other" className="bg-gray-800 text-white">Other</option>
// //               <option value="nextjs" className="bg-gray-800 text-white">Next.js</option>
// //               <option value="react" className="bg-gray-800 text-white">React</option>
// //               <option value="nodejs" className="bg-gray-800 text-white">Node.js</option>
// //             </select>
// //           </div>

// //           {/* Root Directory Section */}
// //           <div className="mb-6">
// //             <div className="flex items-center space-x-3 mb-3">
// //               <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
// //                 <Folder className="h-5 w-5 text-gray-400" />
// //               </motion.div>
// //               <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Root Directory</h2>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <input
// //                 type="text"
// //                 value={rootDirectory}
// //                 onChange={(e) => setRootDirectory(e.target.value)}
// //                 className="w-full bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
// //                 placeholder="/"
// //               />
// //               <motion.button
// //                 whileHover={{ scale: 1.05, y: -2 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 className="px-4 py-2 bg-gray-700/20 border border-gray-600/50 text-gray-200 rounded-lg hover:bg-gray-600/20 hover:text-white transition-all text-sm"
// //               >
// //                 Edit
// //               </motion.button>
// //             </div>
// //           </div>

// //           {/* Build and Output Settings Section (Accordion) */}
// //           <div className="mb-6">
// //             <motion.button
// //               onClick={() => setBuildSettingsOpen(!buildSettingsOpen)}
// //               className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
// //             >
// //               <div className="flex items-center space-x-3">
// //                 <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
// //                   <Settings className="h-5 w-5 text-gray-400" />
// //                 </motion.div>
// //                 <h2 className="text-lg font-semibold">Build and Output Settings</h2>
// //               </div>
// //               {buildSettingsOpen ? (
// //                 <ChevronUp className="h-5 w-5 text-gray-400" />
// //               ) : (
// //                 <ChevronDown className="h-5 w-5 text-gray-400" />
// //               )}
// //             </motion.button>
// //             <AnimatePresence>
// //               {buildSettingsOpen && (
// //                 <motion.div
// //                   initial={{ height: 0, opacity: 0 }}
// //                   animate={{ height: "auto", opacity: 1 }}
// //                   exit={{ height: 0, opacity: 0 }}
// //                   transition={{ duration: 0.3 }}
// //                   className="mt-2 p-4 bg-gray-700/10 border border-gray-600/50 rounded-lg text-gray-400 text-sm dark:bg-gray-700/10 dark:border-gray-600/50 dark:text-gray-400"
// //                 >
// //                   <p>Build settings will be auto-detected for Other.</p>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>
// //           </div>

// //           {/* Environment Variables Section (Accordion) */}
// //           <div className="mb-6">
// //             <motion.button
// //               onClick={() => setEnvVarsOpen(!envVarsOpen)}
// //               className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
// //             >
// //               <div className="flex items-center space-x-3">
// //                 <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
// //                   <Settings className="h-5 w-5 text-gray-400" />
// //                 </motion.div>
// //                 <h2 className="text-lg font-semibold">Environment Variables</h2>
// //               </div>
// //               {envVarsOpen ? (
// //                 <ChevronUp className="h-5 w-5 text-gray-400" />
// //               ) : (
// //                 <ChevronDown className="h-5 w-5 text-gray-400" />
// //               )}
// //             </motion.button>
// //             <AnimatePresence>
// //               {envVarsOpen && (
// //                 <motion.div
// //                   initial={{ height: 0, opacity: 0 }}
// //                   animate={{ height: "auto", opacity: 1 }}
// //                   exit={{ height: 0, opacity: 0 }}
// //                   transition={{ duration: 0.3 }}
// //                   className="mt-2 space-y-2"
// //                 >
// //                   {envVars.map((env, index) => (
// //                     <motion.div
// //                       key={index}
// //                       initial={{ opacity: 0, y: -10 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       transition={{ duration: 0.3 }}
// //                       className="flex space-x-2"
// //                     >
// //                       <input
// //                         type="text"
// //                         value={env.key}
// //                         onChange={(e) => updateEnvVar(index, "key", e.target.value)}
// //                         className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
// //                         placeholder="Key"
// //                       />
// //                       <input
// //                         type="text"
// //                         value={env.value}
// //                         onChange={(e) => updateEnvVar(index, "value", e.target.value)}
// //                         className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
// //                         placeholder="Value"
// //                       />
// //                     </motion.div>
// //                   ))}
// //                   <motion.button
// //                     whileHover={{ scale: 1.05, y: -2 }}
// //                     whileTap={{ scale: 0.95 }}
// //                     onClick={addEnvVar}
// //                     className="w-full flex items-center justify-center bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600/20 hover:text-white transition-all text-sm mt-2"
// //                   >
// //                     <Plus className="h-4 w-4 mr-2" /> Add Variable
// //                   </motion.button>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>
// //           </div>

// //           {/* Deploy Button */}
// //           <motion.button
// //             whileHover={{
// //               scale: 1.05,
// //               y: -2,
// //               boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)",
// //             }}
// //             whileTap={{ scale: 0.95 }}
// //             animate={{
// //               scale: [1, 1.02, 1],
// //               transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
// //             }}
// //             onClick={handleDeploy}
// //             disabled={isDeploying}
// //             className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all text-sm flex items-center justify-center space-x-2 shadow-lg ${
// //               isDeploying ? "opacity-50 cursor-not-allowed" : ""
// //             }`}
// //           >
// //             {isDeploying ? (
// //               <motion.div
// //                 animate={{ rotate: 360 }}
// //                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
// //                 className="h-5 w-5 border-2 border-t-white border-gray-400 rounded-full"
// //               />
// //             ) : (
// //               <>
// //                 <Play className="h-5 w-5" />
// //                 <span>Deploy</span>
// //               </>
// //             )}
// //           </motion.button>
// //         </motion.div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default NewDeployment;

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Code,
//   Folder,
//   Settings,
//   Play,
//   ChevronDown,
//   ChevronUp,
//   Plus,
//   ArrowLeft,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";
// import { io } from "socket.io-client";
// import { useAuth } from "@clerk/clerk-react";

// // Define the shape of a GitHub repository



// const NewDeployment = () => {
//   const navigate = useNavigate();
//   const { userId } = useAuth();

//   const [projectName, setProjectName] = useState("code-haven");
//   const [rootDirectory, setRootDirectory] = useState("/");
//   const [isDeploying, setIsDeploying] = useState(false);
//   const [buildSettingsOpen, setBuildSettingsOpen] = useState(false);
//   const [envVarsOpen, setEnvVarsOpen] = useState(true);
//   const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);
//   const [status, setStatus] = useState("");
//   const [reposOpen, setReposOpen] = useState(false);
//   const [repos, setRepos] = useState([]);
//   const [selectedRepo, setSelectedRepo] = useState("");

//   const socket = io("http://localhost:3000");

//   // Fetch GitHub repositories when the repos box is opened
//   useEffect(() => {
//     const fetchRepos = async () => {
//         console.log("hi")
//       if (!userId || !reposOpen) return;

//       try {
//         const response = await fetch(`http://localhost:3000/get_repos?userId=${userId}`);
//         console.log(response)
//         if (!response.ok) {
//           throw new Error("Failed to fetch repositories");
//         }
//         const data = await response.json();
//         setRepos(data.repos);
//         if (data.repos.length > 0) {
//           setSelectedRepo(data.repos[0].url); // Set default selection
//         }
//       } catch (error) {
//         console.error("Error fetching repos:", error);
//         setStatus(`failed: ${error instanceof Error ? error.message : "Unknown error"}`);
//       }
//     };

//     fetchRepos();
//   }, [userId, reposOpen]);

//   // WebSocket setup for real-time updates
//   useEffect(() => {
//     socket.on("status-update", (data) => {
//       setStatus(`${data.status}: ${data.message || ""}`);
//       if (data.status === "failed") {
//         setIsDeploying(false);
//       } else if (data.status === "building") {
//         setTimeout(() => {
//           alert("Deployment completed successfully! Check the dashboard for details.");
//           navigate("/");
//         }, 2000);
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [socket, navigate]);

//   const handleDeploy = async () => {
//     if (!selectedRepo) {
//       setStatus("failed: Please select a repository");
//       return;
//     }

//     setIsDeploying(true);
//     setStatus("starting: Initiating deployment process...");

//     try {
//       const response = await fetch("http://localhost:3000/deploy", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           repoUrl: selectedRepo,
//           projectName,
//           envVars,
//           userId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Deployment failed");
//       }

//       const data = await response.json();
//       socket.emit("subscribe", data.id);
//     } catch (error) {
//       setStatus(`failed: ${error instanceof Error ? error.message : "Unknown error"}`);
//       setIsDeploying(false);
//     }
//   };

//   const addEnvVar = () => {
//     setEnvVars([...envVars, { key: "", value: "" }]);
//   };

//   const updateEnvVar = (index, field, value) => {
//     const newEnvVars = [...envVars];
//     newEnvVars[index][field] = value;
//     setEnvVars(newEnvVars);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-sans dark:from-gray-950 dark:to-gray-900 dark:text-white">
//       {/* Header with Back Button */}
//       <header className="p-4 flex items-center space-x-3">
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => navigate("/")}
//           className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all"
//         >
//           <ArrowLeft className="h-5 w-5" />
//           <span>Back to Dashboard</span>
//         </motion.button>
//       </header>

//       {/* Main Content */}
//       <main className="flex items-center justify-center px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-2xl p-8 w-full max-w-4xl shadow-2xl dark:bg-gray-800/30 dark:border-gray-600/50"
//         >
//           <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-400 dark:to-indigo-500">
//             New Project
//           </h1>

//           {/* GitHub Repository Selection Section */}
//           <div className="mb-6">
//             <motion.button
//               onClick={() => setReposOpen(!reposOpen)}
//               className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
//             >
//               <div className="flex items-center space-x-3">
//                 <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
//                   <GitHubLogoIcon className="h-5 w-5 text-gray-400" />
//                 </motion.div>
//                 <h2 className="text-lg font-semibold">Import from GitHub</h2>
//               </div>
//               {reposOpen ? (
//                 <ChevronUp className="h-5 w-5 text-gray-400" />
//               ) : (
//                 <ChevronDown className="h-5 w-5 text-gray-400" />
//               )}
//             </motion.button>
//             <AnimatePresence>
//               {reposOpen && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-2"
//                 >
//                   <select
//                     value={selectedRepo}
//                     onChange={(e) => setSelectedRepo(e.target.value)}
//                     className="w-full bg-gray-700/20 border border-gray-600/50 text-white appearance-none rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white"
//                   >
//                     <option value="" disabled>
//                       Select a repository
//                     </option>
//                     {repos.map((repo) => (
//                       <option key={repo.fullName} value={repo.url} className="bg-gray-800 text-white">
//                         {repo.fullName} - {repo.defaultBranch}
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-gray-500 text-sm mt-2 dark:text-gray-500">
//                     Choose a repository to import and configure your project.
//                   </p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Project Name Section */}
//           <div className="mb-6">
//             <div className="flex items-center space-x-3 mb-3">
//               <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
//                 <Code className="h-5 w-5 text-gray-400" />
//               </motion.div>
//               <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Project Name</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <input
//                 type="text"
//                 value={projectName}
//                 onChange={(e) => setProjectName(e.target.value)}
//                 className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
//                 placeholder="e.g., harsimranjit2004's project (Hobby)"
//               />
//               <span className="w-1/2 text-gray-400 text-sm">{projectName}</span>
//             </div>
//           </div>

//           {/* Framework Preset Section */}
//           <div className="mb-6">
//             <div className="flex items-center space-x-3 mb-3">
//               <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
//                 <Code className="h-5 w-5 text-gray-400" />
//               </motion.div>
//               <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Framework Preset</h2>
//             </div>
//             <select
//               className="w-full bg-gray-700/20 border border-gray-600/50 text-white appearance-none rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white"
//             >
//               <option value="other" className="bg-gray-800 text-white">Other</option>
//               <option value="nextjs" className="bg-gray-800 text-white">Next.js</option>
//               <option value="react" className="bg-gray-800 text-white">React</option>
//               <option value="nodejs" className="bg-gray-800 text-white">Node.js</option>
//             </select>
//           </div>

//           {/* Root Directory Section */}
//           <div className="mb-6">
//             <div className="flex items-center space-x-3 mb-3">
//               <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
//                 <Folder className="h-5 w-5 text-gray-400" />
//               </motion.div>
//               <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Root Directory</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <input
//                 type="text"
//                 value={rootDirectory}
//                 onChange={(e) => setRootDirectory(e.target.value)}
//                 className="w-full bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
//                 placeholder="/"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 bg-gray-700/20 border border-gray-600/50 text-gray-200 rounded-lg hover:bg-gray-600/20 hover:text-white transition-all text-sm"
//               >
//                 Edit
//               </motion.button>
//             </div>
//           </div>

//           {/* Build and Output Settings Section (Accordion) */}
//           <div className="mb-6">
//             <motion.button
//               onClick={() => setBuildSettingsOpen(!buildSettingsOpen)}
//               className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
//             >
//               <div className="flex items-center space-x-3">
//                 <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
//                   <Settings className="h-5 w-5 text-gray-400" />
//                 </motion.div>
//                 <h2 className="text-lg font-semibold">Build and Output Settings</h2>
//               </div>
//               {buildSettingsOpen ? (
//                 <ChevronUp className="h-5 w-5 text-gray-400" />
//               ) : (
//                 <ChevronDown className="h-5 w-5 text-gray-400" />
//               )}
//             </motion.button>
//             <AnimatePresence>
//               {buildSettingsOpen && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-2 p-4 bg-gray-700/10 border border-gray-600/50 rounded-lg text-gray-400 text-sm dark:bg-gray-700/10 dark:border-gray-600/50 dark:text-gray-400"
//                 >
//                   <p>Build settings will be auto-detected for Other.</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Environment Variables Section (Accordion) */}
//           <div className="mb-6">
//             <motion.button
//               onClick={() => setEnvVarsOpen(!envVarsOpen)}
//               className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
//             >
//               <div className="flex items-center space-x-3">
//                 <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
//                   <Settings className="h-5 w-5 text-gray-400" />
//                 </motion.div>
//                 <h2 className="text-lg font-semibold">Environment Variables</h2>
//               </div>
//               {envVarsOpen ? (
//                 <ChevronUp className="h-5 w-5 text-gray-400" />
//               ) : (
//                 <ChevronDown className="h-5 w-5 text-gray-400" />
//               )}
//             </motion.button>
//             <AnimatePresence>
//               {envVarsOpen && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-2 space-y-2"
//                 >
//                   {envVars.map((env, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="flex space-x-2"
//                     >
//                       <input
//                         type="text"
//                         value={env.key}
//                         onChange={(e) => updateEnvVar(index, "key", e.target.value)}
//                         className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
//                         placeholder="Key"
//                       />
//                       <input
//                         type="text"
//                         value={env.value}
//                         onChange={(e) => updateEnvVar(index, "value", e.target.value)}
//                         className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
//                         placeholder="Value"
//                       />
//                     </motion.div>
//                   ))}
//                   <motion.button
//                     whileHover={{ scale: 1.05, y: -2 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={addEnvVar}
//                     className="w-full flex items-center justify-center bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600/20 hover:text-white transition-all text-sm mt-2"
//                   >
//                     <Plus className="h-4 w-4 mr-2" /> Add Variable
//                   </motion.button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Deploy Button */}
//           <motion.button
//             whileHover={{
//               scale: 1.05,
//               y: -2,
//               boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)",
//             }}
//             whileTap={{ scale: 0.95 }}
//             animate={{
//               scale: [1, 1.02, 1],
//               transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
//             }}
//             onClick={handleDeploy}
//             disabled={isDeploying || !selectedRepo}
//             className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all text-sm flex items-center justify-center space-x-2 shadow-lg ${
//               (isDeploying || !selectedRepo) ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isDeploying ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 className="h-5 w-5 border-2 border-t-white border-gray-400 rounded-full"
//               />
//             ) : (
//               <>
//                 <Play className="h-5 w-5" />
//                 <span>Deploy</span>
//               </>
//             )}
//           </motion.button>

//           {/* Status Display */}
//           {status && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-4 text-center text-yellow-400"
//             >
//               {status}
//             </motion.div>
//           )}
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// export default NewDeployment;a

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Folder,
  Settings,
  Play,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react"; // Switch to useUser

const NewDeployment = () => {
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser(); // Use useUser to get user data
  const [projectName, setProjectName] = useState("code-haven");
  const [rootDirectory, setRootDirectory] = useState("/");
  const [isDeploying, setIsDeploying] = useState(false);
  const [buildSettingsOpen, setBuildSettingsOpen] = useState(false);
  const [envVarsOpen, setEnvVarsOpen] = useState(true);
  const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);
  const [status, setStatus] = useState("");
  const [reposOpen, setReposOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");

  const socket = io("http://localhost:3000");

  // Debug the user state
  useEffect(() => {
    console.log("User State:", {
      userId: user?.id,
      isLoaded: userLoaded,
      isSignedIn,
    });
    if (!userLoaded) {
      console.log("Clerk is still loading user state...");
    } else if (!isSignedIn || !user) {
      console.log("User is not signed in.");
      setStatus("failed: Please sign in to deploy a project.");
    } else if (!user.id) {
      console.log("User is signed in, but user.id is null.");
      setStatus("failed: Unable to retrieve user ID. Please try signing out and back in.");
    } else {
      console.log("User is signed in with ID:", user.id);
    }
  }, [userLoaded, isSignedIn, user]);
  const socketRef = useRef(null);

  // Initialize socket only once
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");
      console.log("Socket initialized");
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    socket.on("status-update", (data) => {
      console.log("Received status-update:", data);
      setStatus(`${data.status}: ${data.message || ""}`);
      if(data.status == "deployed"){
        setTimeout(() => {
                    alert("Deployment completed successfully! Check the dashboard for details.");
                    navigate("/");
                  }, 2000);
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected on cleanup");
      }
    };
  }, [navigate]); // Remove socket from dependencies since it's managed by ref

  const handleDeploy = async () => {
    if (!isSignedIn || !user?.id) {
      setStatus("failed: Please sign in to deploy a project.");
      return;
    }

    if (!selectedRepo) {
      setStatus("failed: Please select a repository");
      return;
    }

    setIsDeploying(true);
    setStatus("starting: Initiating deployment process...");

    try {
      const response = await fetch("http://localhost:3000/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: selectedRepo,
          projectName,
          envVars,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Deployment failed");
      }

      const data = await response.json();
      console.log("Deploy response:", data);
      socketRef.current.emit("subscribe", data.id);
      console.log(`Subscribed to projectId: ${data.id}`);
    } catch (error) {
      setStatus(`failed: ${error.message || "Unknown error"}`);
      setIsDeploying(false);
    }
  };
  // Fetch GitHub repositories when the repos box is opened
  useEffect(() => {
    const fetchRepos = async () => {
      // Prevent fetching if Clerk isn't loaded, user isn't signed in, or user.id is null
      if (!userLoaded || !isSignedIn || !user?.id || !reposOpen) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/get_repos?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        // Ensure repos is an array and has the expected structure
        if (Array.isArray(data.repos)) {
          setRepos(data.repos);
          if (data.repos.length > 0) {
            setSelectedRepo(data.repos[0].url); // Set default to first repo's URL
          }
        } else {
          console.error("Unexpected response format:", data);
          setStatus("failed: Invalid repository data from server");
        }
      } catch (error) {
        console.error("Error fetching repos:", error);
        setStatus(`failed: ${error.message || "Unknown error"}`);
      }
    };

    fetchRepos();
  }, [userLoaded, isSignedIn, user, reposOpen]);

  

  // const handleDeploy = async () => {
  //   if (!isSignedIn || !user?.id) {
  //     setStatus("failed: Please sign in to deploy a project.");
  //     return;
  //   }

  //   if (!selectedRepo) {
  //     setStatus("failed: Please select a repository");
  //     return;
  //   }

  //   setIsDeploying(true);
  //   setStatus("starting: Initiating deployment process...");

  //   try {
  //     const response = await fetch("http://localhost:3000/deploy", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         repoUrl: selectedRepo,
  //         projectName,
  //         envVars,
  //         userId: user.id, // Use user.id instead of userId
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Deployment failed");
  //     }

  //     const data = await response.json();
  //     socket.emit("subscribe", data.id);
  //   } catch (error) {
  //     setStatus(`failed: ${error.message || "Unknown error"}`);
  //     setIsDeploying(false);
  //   }
  // };A


  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const updateEnvVar = (index, field, value) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-sans dark:from-gray-950 dark:to-gray-900 dark:text-white">
      {/* Header with Back Button */}
      <header className="p-4 flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-2xl p-8 w-full max-w-4xl shadow-2xl dark:bg-gray-800/30 dark:border-gray-600/50"
        >
          <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-400 dark:to-indigo-500">
            New Project
          </h1>

          {/* GitHub Repository Selection Section */}
          <div className="mb-6">
            <motion.button
              onClick={() => setReposOpen(!reposOpen)}
              className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
            >
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
                  <GitHubLogoIcon className="h-5 w-5 text-gray-400" />
                </motion.div>
                <h2 className="text-lg font-semibold">Import from GitHub</h2>
              </div>
              {reposOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </motion.button>
            <AnimatePresence>
              {reposOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2"
                >
                  {userLoaded && isSignedIn && user?.id ? (
                    <>
                      <select
                        value={selectedRepo}
                        onChange={(e) => setSelectedRepo(e.target.value)}
                        className="w-full bg-gray-700/20 border border-gray-600/50 text-white appearance-none rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white"
                      >
                        <option value="" disabled>
                          Select a repository
                        </option>
                        {repos.map((repo) => (
                          <option
                            key={repo.fullName || repo.name}
                            value={repo.url}
                            className="bg-gray-800 text-white"
                          >
                            {repo.fullName || repo.name} - {repo.defaultBranch || "main"}
                          </option>
                        ))}
                      </select>
                      <p className="text-gray-500 text-sm mt-2 dark:text-gray-500">
                        Choose a repository to import and configure your project.
                      </p>
                    </>
                  ) : (
                    <p className="text-yellow-400 text-sm mt-2">
                      {userLoaded
                        ? "Please sign in to view your repositories."
                        : "Loading user state..."}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Project Name Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
                <Code className="h-5 w-5 text-gray-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Project Name</h2>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
                placeholder="e.g., harsimranjit2004's project (Hobby)"
              />
              <span className="w-1/2 text-gray-400 text-sm">{projectName}</span>
            </div>
          </div>

          {/* Framework Preset Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
                <Code className="h-5 w-5 text-gray-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Framework Preset</h2>
            </div>
            <select
              className="w-full bg-gray-700/20 border border-gray-600/50 text-white appearance-none rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white"
            >
              <option value="other" className="bg-gray-800 text-white">Other</option>
              <option value="nextjs" className="bg-gray-800 text-white">Next.js</option>
              <option value="react" className="bg-gray-800 text-white">React</option>
              <option value="nodejs" className="bg-gray-800 text-white">Node.js</option>
            </select>
          </div>

          {/* Root Directory Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
                <Folder className="h-5 w-5 text-gray-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">Root Directory</h2>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={rootDirectory}
                onChange={(e) => setRootDirectory(e.target.value)}
                className="w-full bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
                placeholder="/"
              />
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-700/20 border border-gray-600/50 text-gray-200 rounded-lg hover:bg-gray-600/20 hover:text-white transition-all text-sm"
              >
                Edit
              </motion.button>
            </div>
          </div>

          {/* Build and Output Settings Section (Accordion) */}
          <div className="mb-6">
            <motion.button
              onClick={() => setBuildSettingsOpen(!buildSettingsOpen)}
              className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
            >
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
                  <Settings className="h-5 w-5 text-gray-400" />
                </motion.div>
                <h2 className="text-lg font-semibold">Build and Output Settings</h2>
              </div>
              {buildSettingsOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </motion.button>
            <AnimatePresence>
              {buildSettingsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 p-4 bg-gray-700/10 border border-gray-600/50 rounded-lg text-gray-400 text-sm dark:bg-gray-700/10 dark:border-gray-600/50 dark:text-gray-400"
                >
                  <p>Build settings will be auto-detected for Other.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Environment Variables Section (Accordion) */}
          <div className="mb-6">
            <motion.button
              onClick={() => setEnvVarsOpen(!envVarsOpen)}
              className="w-full flex items-center justify-between bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-600/20 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/20"
            >
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.1 }} className="h-5 w-5">
                  <Settings className="h-5 w-5 text-gray-400" />
                </motion.div>
                <h2 className="text-lg font-semibold">Environment Variables</h2>
              </div>
              {envVarsOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </motion.button>
            <AnimatePresence>
              {envVarsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 space-y-2"
                >
                  {envVars.map((env, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex space-x-2"
                    >
                      <input
                        type="text"
                        value={env.key}
                        onChange={(e) => updateEnvVar(index, "key", e.target.value)}
                        className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
                        placeholder="Key"
                      />
                      <input
                        type="text"
                        value={env.value}
                        onChange={(e) => updateEnvVar(index, "value", e.target.value)}
                        className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
                        placeholder="Value"
                      />
                    </motion.div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addEnvVar}
                    className="w-full flex items-center justify-center bg-gray-700/20 border border-gray-600/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600/20 hover:text-white transition-all text-sm mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Variable
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Deploy Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              y: -2,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.02, 1],
              transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
            }}
            onClick={handleDeploy}
            disabled={isDeploying || !selectedRepo || !isSignedIn || !user?.id}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all text-sm flex items-center justify-center space-x-2 shadow-lg ${
              (isDeploying || !selectedRepo || !isSignedIn || !user?.id) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeploying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-t-white border-gray-400 rounded-full"
              />
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Deploy</span>
              </>
            )}
          </motion.button>

          {/* Status Display */}
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-yellow-400"
            >
              {status}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default NewDeployment;