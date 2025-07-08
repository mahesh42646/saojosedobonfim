// API Configuration
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br/api';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br/api';

// Base URL for static files (without /api prefix)
export const STATIC_BASE_URL = process.env.NEXT_PUBLIC_STATIC_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function to build static file URLs (for uploads, etc.)
export const buildStaticUrl = (path) => {
  return `${STATIC_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}; 