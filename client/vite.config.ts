import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    host: true,
    strictPort: true,
    // proxy: {
    //   '/api': 'http://localhost:8000',
    //   '/server': 'http://localhost:3000'
    // }
  }
})
