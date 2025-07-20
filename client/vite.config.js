import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://3.109.255.75:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
