import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGitHubRepos = async () => {
      setLoading(true);
      setError("");

      if (!user) return;

      try {
        // Step 1: Find GitHub account from Clerkj
        console.log("External Accounts:", user.externalAccounts);

        const githubAccount = user.externalAccounts.find((acc) => acc.provider === "oauth_github");
        console.log(githubAccount)
        if (!githubAccount) {
          setError("No GitHub account linked.");
          setLoading(false);
          return;
        }

        // Step 2: Get the OAuth Access Token (This requires Clerk Backend API)
        const response = await fetch(
          `https://api.clerk.dev/v1/users/${user.id}/oauth_access_tokens/oauth_github`,
          {
            headers: {
              Authorization: `Bearer ${user.sessionClaims.jwt}`, // Authenticated request
            },
          }
        );

        if (!response.ok) {
          setError("Failed to retrieve GitHub access token.");
          setLoading(false);
          return;
        }

        const { token } = await response.json(); // Extract token

        // Step 3: Fetch GitHub Repositories
        const repoResponse = await fetch(`https://api.github.com/user/repos`, {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!repoResponse.ok) {
          setError("Failed to fetch GitHub repositories.");
          setLoading(false);
          return;
        }

        const repoData = await repoResponse.json();
        setRepos(repoData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching GitHub repositories:", err);
        setError("Unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchGitHubRepos();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black px-6">
      {/* Show Dashboard only if user is signed in */}
      <SignedIn>
        {/* Navbar-like Header with User Profile */}
        <div className="w-full max-w-7xl flex justify-between items-center px-8 py-4 bg-gray-900 text-white rounded-lg mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-6">Welcome to Your Dashboard</h1>
        <p className="text-gray-400">Your GitHub Repositories:</p>

        {/* Loading State */}
        {loading && <p className="text-gray-400 mt-4">Fetching repositories...</p>}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* GitHub Repos */}
        {repos.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <h2 className="text-lg font-semibold">{repo.name}</h2>
                <p className="text-gray-400 text-sm">{repo.description || "No description available"}</p>
              </a>
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-400 mt-6">No repositories found or GitHub login is required.</p>
        )}
      </SignedIn>

      {/* Redirect to Signup if user is signed out */}
      <SignedOut>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg mt-6"
          onClick={() => navigate("/signup")}
        >
          Sign Up to Access Dashboard
        </button>
      </SignedOut>
    </div>
  );
};

export default Dashboard;
