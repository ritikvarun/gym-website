const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_URL = isLocal 
  ? 'http://localhost:5000' 
  : (import.meta.env.VITE_API_URL || 'https://gym-backend-7h79.onrender.com');

