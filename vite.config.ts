import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative base keeps the SAME build working on both GitHub Pages
  // (/adnan-mehraj-portfolio/) and Cloudflare Pages (/) without separate
  // codebases or deployment-specific builds.
  base: './',
  plugins: [react()],
})