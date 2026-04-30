import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Add this esbuild section to force React to be defined globally
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})