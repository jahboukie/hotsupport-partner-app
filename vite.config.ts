import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3021,
    host: true,
    proxy: {
      '/api/mama-grace': {
        target: 'http://localhost:3022',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mama-grace/, '/mama-grace')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})