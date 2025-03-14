import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus, Menu, X as XIcon, Sun, Moon, MoreHorizontal, RefreshCw, FileText, Trash2, Code, Zap, Activity, Globe, BarChart, Settings, Book, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

// Dummy data (replace with API call)
const initialProjects = [
  {
    id: "1",
    name: "portfolio-frontend",
    framework: "Next.js",
    domain: "portfolio-frontend-seven-kappa.vercel.app",
    status: "Dev Contact",
    latest: "Merged PR #1 from dev on main - Dec 11, 2024",
    lastDeployed: "Dec 10, 2024",
    team: "Alpha Team",
  },
  {
    id: "2",
    name: "harsimranjit2004.vercel.app",
    framework: "React",
    domain: "harsimranjit2004.vercel.app",
    status: "Deployed",
    latest: "Merged PR #2 from dev on main - Dec 11, 2024",
    lastDeployed: "Dec 10, 2024",
    team: "Beta Team",
  },
  {
    id: "3",
    name: "portfolio-backend",
    framework: "Node.js",
    domain: "portfolio-backend-pearl-alpha.vercel.app",
    status: "Building",
    latest: "Updated from backend - Dec 18, 2024",
    lastDeployed: "Dec 17, 2024",
    team: "Alpha Team",
  },
  {
    id: "4",
    name: "web-assignment-5",
    framework: "Vanilla JS",
    domain: "web-assignment-5.vercel.app",
    status: "Failed",
    latest: "Pushed assignment6 - Nov 21, 2024",
    lastDeployed: "Nov 20, 2024",
    team: "Gamma Team",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("activity");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFramework, setFilterFramework] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [toasts, setToasts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const observer = useRef();

  const projectsPerLoad = 3;

  // Simulate fetching projects
  useEffect(() => {
    setTimeout(() => {
      setProjects(initialProjects);
      setVisibleProjects(initialProjects.slice(0, projectsPerLoad));
      setLoading(false);
    }, 1000);
  }, []);

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.status === "Building" && Math.random() > 0.7) {
            return { ...project, status: "Deployed", latest: `Deployed successfully - ${new Date().toLocaleDateString()}` };
          }
          return project;
        })
      );
      setVisibleProjects((prevVisible) =>
        prevVisible.map((project) => {
          if (project.status === "Building" && Math.random() > 0.7) {
            return { ...project, status: "Deployed", latest: `Deployed successfully - ${new Date().toLocaleDateString()}` };
          }
          return project;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Theme toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Infinite scroll
  const lastProjectRef = useRef();
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setVisibleProjects((prev) => {
          const nextIndex = prev.length;
          const nextProjects = sortedProjects.slice(nextIndex, nextIndex + projectsPerLoad);
          if (nextIndex + projectsPerLoad >= sortedProjects.length) {
            setHasMore(false);
          }
          return [...prev, ...nextProjects];
        });
      }
    });
    if (lastProjectRef.current) observer.current.observe(lastProjectRef.current);
  }, [loading, hasMore]);

  // Filter and sort projects
  const filteredProjects = projects.filter(
    (project) =>
      (filterStatus === "All" || project.status === filterStatus) &&
      (filterFramework === "All" || project.framework === filterFramework) &&
      (project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOption === "activity") {
      return new Date(b.latest.split(" - ")[1]) - new Date(a.latest.split(" - ")[1]);
    } else if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Update visible projects when filters or sorting changes
  useEffect(() => {
    setVisibleProjects(sortedProjects.slice(0, projectsPerLoad));
    setHasMore(sortedProjects.length > projectsPerLoad);
  }, [filterStatus, filterFramework, searchQuery, sortOption]);

  // Status styles
  const statusStyles = {
    "Dev Contact": "bg-yellow-500/20 text-yellow-400",
    Deployed: "bg-green-500/20 text-green-400",
    Building: "bg-purple-500/20 text-purple-400",
    Failed: "bg-red-500/20 text-red-400",
  };

  // Framework icons
  const frameworkIcons = {
    "Next.js": <Zap className="h-5 w-5 text-green-400" />,
    React: <Code className="h-5 w-5 text-blue-400" />,
    "Node.js": <Activity className="h-5 w-5 text-green-400" />,
    "Vanilla JS": <Globe className="h-5 w-5 text-gray-400" />,
  };

  // Toast notification handler
  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <div className={`h-screen w-screen flex font-sans overflow-hidden ${theme === "dark" ? "bg-gradient-to-br from-gray-900 to-black text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar (Sticky on Desktop, Hidden on Mobile) */}
      <aside className="hidden lg:block w-64 bg-gradient-to-br from-gray-800 to-gray-900 border-r border-gray-700 h-full sticky top-0 overflow-y-auto dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
        <div className="p-6 flex items-center space-x-3">
          <span className="font-semibold text-xl dark:text-white">harsimranjit2004</span>
          <span className="text-gray-400 text-sm">Hobby</span>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { name: "Overview", icon: <Code className="h-5 w-5 mr-2" /> },
            { name: "Integrations", icon: <Zap className="h-5 w-5 mr-2" /> },
            { name: "Activity", icon: <Activity className="h-5 w-5 mr-2" /> },
            { name: "Domains", icon: <Globe className="h-5 w-5 mr-2" /> },
            { name: "Usage", icon: <BarChart className="h-5 w-5 mr-2" /> },
            { name: "Settings", icon: <Settings className="h-5 w-5 mr-2" /> },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
          <div className="pt-6 flex flex-col space-y-2">
            <a href="#" className="flex items-center text-gray-300 hover:text-white text-sm dark:text-gray-300 dark:hover:text-white">
              <Book className="h-5 w-5 mr-2" /> Docs
            </a>
            <a href="#" className="flex items-center text-gray-300 hover:text-white text-sm dark:text-gray-300 dark:hover:text-white">
              <HelpCircle className="h-5 w-5 mr-2" /> Help
            </a>
          </div>
        </nav>
      </aside>

      {/* Mobile Top Nav */}
      <nav className="lg:hidden fixed top-0 left-0 w-full bg-gradient-to-br from-gray-800 to-gray-900 border-b border-gray-700 z-20 shadow-md dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-xl dark:text-white">harsimranjit2004</span>
            <span className="text-gray-400 text-sm">Hobby</span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
            <button
              className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-gradient-to-br from-gray-800 to-gray-900 border-t border-gray-700 px-4 py-4 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700"
            >
              <div className="flex flex-col space-y-4">
                {[
                  { name: "Overview", icon: <Code className="h-5 w-5 mr-2" /> },
                  { name: "Integrations", icon: <Zap className="h-5 w-5 mr-2" /> },
                  { name: "Activity", icon: <Activity className="h-5 w-5 mr-2" /> },
                  { name: "Domains", icon: <Globe className="h-5 w-5 mr-2" /> },
                  { name: "Usage", icon: <BarChart className="h-5 w-5 mr-2" /> },
                  { name: "Settings", icon: <Settings className="h-5 w-5 mr-2" /> },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className="flex items-center text-gray-300 hover:text-white transition-colors text-sm dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 flex flex-col space-y-2">
                  <a href="#" className="flex items-center text-gray-300 hover:text-white text-sm dark:text-gray-300 dark:hover:text-white">
                    <Book className="h-5 w-5 mr-2" /> Docs
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white text-sm dark:text-gray-300 dark:hover:text-white">
                    <HelpCircle className="h-5 w-5 mr-2" /> Help
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-30 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/90 backdrop-blur-md border border-gray-700 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 dark:bg-gray-800/90 dark:border-gray-700 dark:text-white"
            >
              <span>{toast.message}</span>
              <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <X className="h-4 w-4 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto lg:pt-0 pt-16">
        {/* Sticky Search and Filters */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md p-6 border-b border-gray-700 lg:pt-6 dark:bg-gray-900/95 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6 w-full lg:w-auto">
              <div className="relative w-full lg:w-80">
                <input
                  type="text"
                  placeholder="Search Projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm dark:bg-gray-800/50 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                {searchQuery && (
                  <X
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer hover:text-white dark:text-gray-500 dark:hover:text-white"
                    onClick={() => setSearchQuery("")}
                  />
                )}
              </div>
              <span className="text-gray-400 text-sm dark:text-gray-400">{projects.length} Projects</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 text-white appearance-none rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                >
                  <option value="activity" className="bg-gray-900 text-white">
                    Sort by Activity
                  </option>
                  <option value="name" className="bg-gray-900 text-white">
                    Sort by Name
                  </option>
                  <option value="status" className="bg-gray-900 text-white">
                    Sort by Status
                  </option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/new-deployment")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all text-sm shadow-md"
              >
                <Plus className="h-5 w-5" />
                <span>Add New</span>
              </motion.button>
              <UserButton/>
            </div>

          </div>
          <div className="flex flex-wrap items-center space-x-2 mt-4 overflow-x-auto">
            {["All", "Deployed", "Building", "Failed", "Dev Contact"].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                } dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                  filterStatus === status && "dark:bg-blue-600 dark:text-white"
                }`}
              >
                {status}
              </motion.button>
            ))}
            {["All", "Next.js", "React", "Node.js", "Vanilla JS"].map((framework) => (
              <motion.button
                key={framework}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterFramework(framework)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  filterFramework === framework
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                } dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                  filterFramework === framework && "dark:bg-blue-600 dark:text-white"
                }`}
              >
                {framework}
              </motion.button>
            ))}
            {(filterStatus !== "All" || filterFramework !== "All") && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilterStatus("All");
                  setFilterFramework("All");
                }}
                className="px-4 py-2 rounded-full text-sm bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white transition-all dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Clear Filters
              </motion.button>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <section className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-200 dark:text-gray-200">Recent Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              Array.from({ length: projectsPerLoad }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="h-36 bg-gray-800/50 rounded-xl backdrop-blur-md dark:bg-gray-800/50"
                />
              ))
            ) : visibleProjects.length > 0 ? (
              visibleProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.5)",
                  }}
                  className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 flex flex-col justify-between hover:bg-gray-700/50 transition-all cursor-pointer dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700/50 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {frameworkIcons[project.framework]}
                      <div>
                        <div className="flex items-center space-x-2">
                          <a
                            href="#"
                            className="text-white font-semibold text-lg hover:underline dark:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {project.name}
                          </a>
                        </div>
                        <p className="text-gray-400 text-sm dark:text-gray-400">{project.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.span
                        key={project.status}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[project.status]}`}
                      >
                        {project.status}
                      </motion.span>
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </motion.button>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-8 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-2 space-y-2 hidden group-hover:block dark:bg-gray-800/90 dark:border-gray-700 z-40"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToast(`Redeployed ${project.name}`);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg w-full text-left transition-all dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white z-30"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Redeploy</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/project/${project.id}/logs`);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg w-full text-left transition-all dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white z-30"
                          >
                            <FileText className="h-4 w-4" />
                            <span>View Logs</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjects((prev) => prev.filter((p) => p.id !== project.id));
                              setVisibleProjects((prev) => prev.filter((p) => p.id !== project.id));
                              addToast(`Deleted ${project.name}`);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 hover:text-red-300 rounded-lg w-full text-left transition-all dark:text-red-400 dark:hover:bg-gray-700/50 dark:hover:text-red-300 z-30"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm dark:text-gray-500">{project.latest}</p>
                  </div>
                  {/* <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-4 hidden group-hover:block z-10 dark:bg-gray-800/90 dark:border-gray-700"
                  >
                    <p className="text-gray-400 text-sm dark:text-gray-400">Last Deployed: {project.lastDeployed}</p>
                    <p className="text-gray-400 text-sm dark:text-gray-400">Team: {project.team}</p>
                  </motion.div> */}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-sm dark:text-gray-400">No projects found.</p>
            )}
          </div>
          {/* Infinite Scroll Loader */}
          {hasMore && (
            <div ref={lastProjectRef} className="flex justify-center py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-8 w-8 border-4 border-t-blue-500 border-gray-800 rounded-full dark:border-t-blue-500 dark:border-gray-800"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;