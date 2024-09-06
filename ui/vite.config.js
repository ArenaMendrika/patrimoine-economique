import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permet d'exposer le serveur sur le réseau
    port: process.env.PORT || 5173,  // Utilise le port 5173 en local, ou celui fourni en production
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy les requêtes API vers le backend local sur le port 3000
    },
  },
})

