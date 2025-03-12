// src/Dashboard.jsx
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import GitHubRepos from "../components/GithubRepos";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black px-6">
      <SignedIn>
        <div className="w-full max-w-7xl flex justify-between items-center px-8 py-4 bg-gray-900 text-white rounded-lg mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
        <GitHubRepos />
      </SignedIn>
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
