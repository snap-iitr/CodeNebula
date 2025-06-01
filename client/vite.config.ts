import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // ← change this to your desired port
    host: true, // ← allow access from Docker host
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8000',
      '/server': 'http://localhost:3000'
    }
  }
})
