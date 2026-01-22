/**
 * API Configuration
 * Update these values according to your environment
 */

export const API_CONFIG = {
  // Base URL for your API
  BASE_URL: 'http://3.88.107.152/api/',
  
  // API Timeout in milliseconds
  TIMEOUT: 30000,
  
  // Enable/disable request/response logging
  ENABLE_LOGGING: __DEV__, // Only log in development mode
  
  // API Version (if your API uses versioning)
  API_VERSION: 'v1',
};

// Helper to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.endsWith('/')
    ? API_CONFIG.BASE_URL.slice(0, -1)
    : API_CONFIG.BASE_URL;
  
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

