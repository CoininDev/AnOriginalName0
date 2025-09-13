import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/compare': 'https://urban-space-couscous-r97jx4p9597266r-6868.app.github.dev',
    }
  }
})
