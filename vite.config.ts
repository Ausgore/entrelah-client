import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase"
    }
  },
  resolve: {
    alias: {
      '@api': '/src/api',
      '@components': '/src/components',
      '@contexts': '/src/contexts',
      '@storage': '/src/firebase',
      '@': '/src',
    }
  }
})
