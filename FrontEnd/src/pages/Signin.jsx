import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <SignIn
       afterSignInUrl="/dashboard" />
    </div>
  );
};

export default Signin;
