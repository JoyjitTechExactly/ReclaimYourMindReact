import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../redux/store';
import { API_CONFIG } from './config';
import storage from '../utils/storage';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor - Add Bearer Token and Log Request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from Redux store first
    const state = store.getState();
    let token = state.auth.accessToken || state.auth.token;
    
    // If not in Redux, try to get from AsyncStorage (for initial app load)
    if (!token) {
      try {
        token = await storage.getAccessToken();
      } catch (error) {
        console.warn('Failed to get token from storage:', error);
      }
    }

    // Add Bearer token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details (for OkHttp debugging in React Native)
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log('========== API REQUEST ==========');
      console.log('URL:', config.method?.toUpperCase(), config.url);
      console.log('Base URL:', config.baseURL);
      console.log('Full URL:', `${config.baseURL}${config.url}`);
      console.log('Headers:', JSON.stringify(config.headers, null, 2));
      
      if (config.params) {
        console.log('Query Params:', JSON.stringify(config.params, null, 2));
      }
      
      if (config.data) {
        console.log('Request Body:', JSON.stringify(config.data, null, 2));
      }
    }

    return config;
  },
  (error) => {
    console.error('========== REQUEST ERROR ==========');
    console.error('Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Log Response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response details (for OkHttp debugging in React Native)
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log('========== API RESPONSE ==========');
      console.log('URL:', response.config.method?.toUpperCase(), response.config.url);
      console.log('Status:', response.status, response.statusText);
      console.log('Headers:', JSON.stringify(response.headers, null, 2));
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
    }

    return response;
  },
  (error) => {
    // Log error response
    if (API_CONFIG.ENABLE_LOGGING) {
      if (error.response) {
        console.error('========== API ERROR RESPONSE ==========');
        console.error('URL:', error.config?.method?.toUpperCase(), error.config?.url);
        console.error('Status:', error.response.status, error.response.statusText);
        console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
        console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('========== API REQUEST ERROR ==========');
        console.error('Request:', error.request);
        console.error('No response received');
      } else {
        console.error('========== API ERROR ==========');
        console.error('Error Message:', error.message);
      }
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Optionally dispatch logout action here
      // store.dispatch(logout());
      console.warn('Unauthorized access - Token may be expired');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

