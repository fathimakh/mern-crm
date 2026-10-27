import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Read VITE_* variables from the single .env file in the project root
  envDir: fileURLToPath(new URL('..', import.meta.url)),
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 5174,
  },
  build: {
    rolldownOptions: {
      output: {
        // Put third-party libraries in their own cacheable chunks
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'router-vendor', test: /node_modules[\\/](react-router|react-router-dom)[\\/]/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
})
