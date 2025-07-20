import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Needed for resolving absolute paths

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, 'src/context'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
