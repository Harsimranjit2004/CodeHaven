import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const GitHubRepos = () => {
  const { user } = useUser();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchRepos = async () => {
      try {
        // Use the Vite environment variable if defined, otherwise fallback to localhost:3000
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(
          `${backendUrl}/get_repos?userId=${user.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setRepos(data.repos);
        }
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
        setError("Failed to fetch repositories.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [user]);

  if (loading) return <p>Loading repositories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">Your GitHub Repositories</h2>
      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <li key={repo.id} className="bg-gray-800 p-4 rounded shadow hover:shadow-lg transition-shadow">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">
                {repo.name} {repo.private && "(Private)"}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default GitHubRepos;
