import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: 'src/features/chatbot/index.jsx',
      name: 'Chatbot',
      fileName: 'chatbot',
      formats: ['umd', 'es'], // UMD for script tag, ES for NPM
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Externalize React
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
