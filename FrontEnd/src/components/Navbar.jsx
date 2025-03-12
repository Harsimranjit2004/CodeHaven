import React from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full fixed top-0 left-0 flex justify-center py-4 z-50">
      <div className="w-full max-w-7xl flex justify-between items-center px-8">
        {/* Logo on Left */}
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold tracking-tight text-white focus:outline-none"
        >
          CodeHaven
        </button>

        {/* Centered Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <button className="text-gray-300 hover:text-white text-lg focus:outline-none">
            Products
          </button>
          <button className="text-gray-300 hover:text-white text-lg focus:outline-none">
            Solutions
          </button>
          <button className="text-gray-300 hover:text-white text-lg focus:outline-none">
            Pricing
          </button>
        </div>

        {/* Authentication Buttons / User Profile */}
        <div className="flex space-x-4">
          {/* Show Log In & Sign Up if NOT logged in */}
          <SignedOut>
            <button
              onClick={() => navigate("/signin")}
              className="px-5 py-2 border border-gray-500 rounded-md text-gray-300 hover:text-white hover:border-white transition focus:outline-none"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 bg-white text-black font-medium rounded-md flex items-center space-x-2 hover:bg-gray-200 transition focus:outline-none"
            >
              <span>Sign Up</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </SignedOut>

          {/* Show User Profile & Logout if logged in */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
