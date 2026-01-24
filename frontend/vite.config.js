import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({ // will need to manage this stuff later
  plugins: [react()],

  server: {
    proxy: {
      "/crypto-aggregator": {
        target: "http://localhost:5000",
      }
    }
  }
})
