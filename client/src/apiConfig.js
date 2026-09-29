// Automatic API base URL configuration:
// - In local Vite dev (port 5173): routes to http://localhost:8000
// - In production deployment (Railway/Docker): uses current origin (relative path)
// - Can be overridden by VITE_API_BASE_URL env var if needed
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:8000'
    : '')
).replace(/\/$/, '');
