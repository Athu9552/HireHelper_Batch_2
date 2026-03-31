import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// build trigger
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
