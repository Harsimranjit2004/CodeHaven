import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: ['5c72-142-204-17-55.ngrok-free.app'], // ✅ Allow Ngrok
    host: '0.0.0.0', // ✅ Allow external access
    port: 5173, // Set your Vite port
  }
  
})
