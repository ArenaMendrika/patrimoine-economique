import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permet d'exposer le serveur sur le réseau
    port: process.env.PORT || 3000,  // Utilise le port fourni par Render, sinon 3000 par défaut
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy API requests to the backend server
    },
  },
})

