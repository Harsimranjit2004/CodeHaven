import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: true
    // You can also allow all hosts by setting allowedHosts: true,
    // but it's more secure to specify the allowed hosts explicitly.
  },
  build: {
    // Ensure build doesn't rely on browser APIs
    ssr: false,
  },
  
})
