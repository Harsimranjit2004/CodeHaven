import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen px-6">
      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-extrabold tracking-tight leading-tight text-slate-400 max-w-4xl"
      >
        Your complete platform for the web.
      </motion.h1>

      {/* Subtext */}
      <p className="text-gray-500 text-2xl mt-6 max-w-3xl">
        CodeHaven provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex space-x-4">
        <button className="z-44 px-6 py-3 bg-white text-black font-medium rounded-md flex items-center space-x-2 hover:bg-gray-200 transition">
          🚀 Start Deploying
        </button>
        <button className="z-44 px-6 py-3 border border-gray-400 text-gray-300 font-medium rounded-md flex items-center space-x-2 hover:border-white hover:text-white transition">
          Get a Demo
        </button>
      </div>
    </div>
  );
};

export default Hero;
