import React, { useEffect } from "react";
import {BackgroundLines} from "../components/Background"
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";




function Landing() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser(); // Check if user is logged in

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard"); // Redirect to dashboard if already signed in
    }
  }, [isSignedIn, navigate]);
  return (
    <>
    <div>

      <Navbar/>
    <BackgroundLines>
        <Hero/>
    </BackgroundLines>
    </div>
    
    </>
  );
}

export default Landing;
