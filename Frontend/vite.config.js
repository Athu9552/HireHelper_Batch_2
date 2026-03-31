import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// v2
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
