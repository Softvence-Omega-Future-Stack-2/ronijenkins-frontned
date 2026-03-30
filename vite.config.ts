import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        // target: 'https://ronijenkinsserver-production.up.railway.app',
        target: 'http://localhost:8989',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
