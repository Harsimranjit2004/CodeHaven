import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export function ThemeProvider() {
  useEffect(() => {
    const root = document.documentElement;
    
    // Set dark theme colors
    root.style.setProperty("--bg-dark", "#000000"); 
    root.style.setProperty("--text-light", "#ffffff"); 

    const colors = {
      "--sky-300": "#7dd3fc",
      "--pink-300": "#f9a8d4",
      "--green-300": "#86efac",
      "--yellow-300": "#fde047",
      "--red-300": "#f87171",
      "--purple-300": "#c084fc",
      "--blue-300": "#60a5fa",
      "--indigo-300": "#818cf8",
      "--violet-300": "#a78bfa",
    };

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return createPortal(<></>, document.body);
}
