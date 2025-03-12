import React from "react";
import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <SignUp 
       afterSignInUrl="/dashboard"/>
    </div>
  );
};

export default Signup;
