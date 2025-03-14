import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Box, Clock, CheckCircle, XCircle, Play, Trash, Settings, Link, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams(); // Get project ID from the URL
  const navigate = useNavigate();

  // Mock project data (replace with real data from a backend later)
  const [project] = useState({
    id: id,
    name: "code-haven",
    status: "Deployed",
    lastDeployed: "2025-03-13 10:30 AM",
    domain: "code-haven.vercel.app",
    envVars: [
      { key: "API_KEY", value: "abc123" },
      { key: "DATABASE_URL", value: "mongodb://localhost:27017" },
    ],
    deploymentHistory: [
      { id: 1, status: "Deployed", timestamp: "2025-03-13 10:30 AM" },
      { id: 2, status: "Failed", timestamp: "2025-03-12 02:15 PM" },
      { id: 3, status: "Deployed", timestamp: "2025-03-11 09:00 AM" },
    ],
  });

  const [isRedeploying, setIsRedeploying] = useState(false);

  const handleRedeploy = () => {
    setIsRedeploying(true);
    setTimeout(() => {
      setIsRedeploying(false);
      alert("Redeployment completed successfully!");
    }, 3000);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      alert("Project deleted successfully!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-sans dark:from-gray-950 dark:to-gray-900 dark:text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </motion.button>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRedeploy}
            disabled={isRedeploying}
            className={`flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg ${
              isRedeploying ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRedeploying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-t-white border-gray-400 rounded-full"
              />
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Redeploy</span>
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg"
          >
            <Trash className="h-5 w-5" />
            <span>Delete Project</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Project Overview */}
          <div className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-xl p-6 mb-6 shadow-lg dark:bg-gray-800/30 dark:border-gray-600/50">
            <div className="flex items-center space-x-3 mb-4">
              <Box className="h-6 w-6 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-200 dark:text-gray-200">
                {project.name}
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {project.status === "Deployed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : project.status === "Building" ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p className="text-gray-400 text-sm dark:text-gray-400">
                    Status: {project.status}
                  </p>
                </div>
                <p className="text-gray-400 text-sm dark:text-gray-400">
                  Last Deployed: {project.lastDeployed}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Link className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-400 text-sm dark:text-gray-400">
                    Domain: <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{project.domain}</a>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/project/${id}/logs`)}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-all"
                >
                  <FileText className="h-5 w-5" />
                  <span>View Logs</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-xl p-6 mb-6 shadow-lg dark:bg-gray-800/30 dark:border-gray-600/50">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">
                Environment Variables
              </h2>
            </div>
            {project.envVars.length === 0 ? (
              <p className="text-gray-400 text-sm dark:text-gray-400">
                No environment variables set.
              </p>
            ) : (
              <div className="space-y-2">
                {project.envVars.map((env, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={env.key}
                      readOnly
                      className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white px-4 py-3 rounded-lg text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white"
                    />
                    <input
                      type="text"
                      value={env.value}
                      readOnly
                      className="w-1/2 bg-gray-700/20 border border-gray-600/50 text-white px-4 py-3 rounded-lg text-sm dark:bg-gray-700/20 dark:border-gray-600/50 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deployment History */}
          <div className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-xl p-6 shadow-lg dark:bg-gray-800/30 dark:border-gray-600/50">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">
                Deployment History
              </h2>
            </div>
            {project.deploymentHistory.length === 0 ? (
              <p className="text-gray-400 text-sm dark:text-gray-400">
                No deployment history available.
              </p>
            ) : (
              <div className="space-y-2">
                {project.deploymentHistory.map((deployment) => (
                  <div key={deployment.id} className="flex items-center space-x-3 bg-gray-700/10 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {deployment.status === "Deployed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <p className="text-gray-400 text-sm dark:text-gray-400">
                        {deployment.status} at {deployment.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectDetails;