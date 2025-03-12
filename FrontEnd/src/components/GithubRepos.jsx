// src/GitHubRepos.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const GitHubRepos = () => {
  const { user, isLoaded } = useUser();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 console.log(user)
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchRepos = async () => {
      setLoading(true);
      try {
        // Call the backend endpoint with the user's Clerk ID
        const response = await fetch(`http://localhost:3000/api/github/repos?userId=${user.id}`);
        console(response)
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [user, isLoaded]);

  if (!isLoaded) return <div>Loading user data...</div>;
  if (loading) return <div>Fetching repositories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Your GitHub Repositories</h1>
      {repos.length > 0 ? (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
};

export default GitHubRepos;
