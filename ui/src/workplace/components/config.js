// src/config.js
export const backendApiUrl = 
  import.meta.env.MODE === 'development' 
  ? 'http://localhost:3000' // URL du backend local
  : import.meta.env.VITE_URL_BACKEND; // URL du backend en production
