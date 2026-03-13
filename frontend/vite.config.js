import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({ // will need to manage this stuff later
  plugins: [react()],

  preview: {
    host: "0.0.0.0",
    port: "4173",
    allowedHosts: [
      "feisty-inspiration-production-c46b.up.railway.app"
    ]
  },

  server: {
    proxy: {
      "/crypto-aggregator": {
        target: "http://backend:5000",
      },
      "/user": {
        target: "http://backend:5000",
        changeOrigin: true,
      }
    }
  }
})
