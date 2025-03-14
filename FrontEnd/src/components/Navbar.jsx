// import React from "react";
// import { ChevronRightIcon } from "@radix-ui/react-icons";
// import { useNavigate } from "react-router-dom";
// import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

// const Navbar = () => {
//   const navigate = useNavigate();

//   return (
//     <nav className="w-full fixed top-0 left-0 flex justify-center py-4 z-50">
//       <div className="w-full max-w-7xl flex justify-between items-center px-8">
//         {/* Logo on Left */}
//         <button
//           onClick={() => navigate("/")}
//           className="text-2xl font-extrabold tracking-tight text-white focus:outline-none"
//         >
//           CodeHaven
//         </button>

//         {/* Centered Navigation Links */}
//         <div className="hidden md:flex space-x-6">
//           <button className="text-gray-300 hover:text-white text-lg focus:outline-none">
//             Products
//           </button>
//           <button className="text-gray-300 hover:text-white text-lg focus:outline-none">
//             Solutions
//           </button>
//           <button className="text-gray-300 hover:text-white text-lg focus:outline-none">
//             Pricing
//           </button>
//         </div>


//         <div className="flex space-x-4">
//           <SignedOut>
//             <button
//               onClick={() => navigate("/signin")}
//               className="px-5 py-2 border border-gray-500 rounded-md text-gray-300 hover:text-white hover:border-white transition focus:outline-none"
//             >
//               Log In
//             </button>
//             <button
//               onClick={() => navigate("/signup")}
//               className="px-5 py-2 bg-white text-black font-medium rounded-md flex items-center space-x-2 hover:bg-gray-200 transition focus:outline-none"
//             >
//               <span>Sign Up</span>
//               <ChevronRightIcon className="w-5 h-5" />
//             </button>
//           </SignedOut>

//           {/* Show User Profile & Logout if logged in */}
//           <SignedIn>
//           <button className="z-44 px-6 py-3 bg-white text-black font-medium rounded-md flex items-center space-x-2 hover:bg-gray-200 transition">
//           Deploy
//         </button>
//           </SignedIn>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full fixed top-0 left-0 flex justify-center py-4 z-50 bg-black">
      <div className="w-full max-w-7xl flex justify-between items-center px-8">
        {/* Logo on Left */}
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold tracking-tight text-white focus:outline-none hover:text-gray-200 transition-colors"
        >
          CodeHaven
        </button>

        {/* Centered Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <button className="text-gray-300 hover:text-white text-base font-medium focus:outline-none transition-colors">
            Products
          </button>
          <button className="text-gray-300 hover:text-white text-base font-medium focus:outline-none transition-colors">
            Solutions
          </button>
          <button className="text-gray-300 hover:text-white text-base font-medium focus:outline-none transition-colors">
            Pricing
          </button>
        </div>

        {/* Right Side: Auth Buttons or Deploy Button */}
        <div className="flex space-x-4">
          <SignedOut>
            <button
              onClick={() => navigate("/signin")}
              className="px-5 py-2 border border-gray-500 rounded-md text-gray-300 hover:text-white hover:border-white transition focus:outline-none text-sm font-medium"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 bg-white text-black font-medium rounded-md flex items-center space-x-2 hover:bg-gray-200 transition focus:outline-none text-sm"
            >
              <span>Sign Up</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </SignedOut>

          <SignedIn>
            {/* Deploy Button */}
            <button
              onClick={() => navigate("/new-deployment")} // Assuming this is the route for the NewDeployment page
              className="px-6 py-2 bg-white text-black font-medium rounded-md flex items-center space-x-2 hover:bg-gray-200 transition focus:outline-none text-sm"
            >
              <span>Deploy</span>
            </button>
            {/* User Profile Button */}
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;