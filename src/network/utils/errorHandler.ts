import { AxiosError } from 'axios';
import { ApiResponse } from '../types';

/**
 * Error Handler Utility
 * Centralized error handling for all API services
 * Extracts user-friendly error messages from API responses
 */
export const handleError = (error: unknown): ApiResponse<any> => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data;
    const status = error.response?.status;
    
    // Extract error message from different possible structures
    let errorMessage = 'An error occurred. Please try again.';
    
    if (errorData) {
      // Handle validation errors (422) - extract first error message
      if (status === 422 && errorData.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        const firstError = errorData.errors[firstErrorKey];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        } else if (typeof firstError === 'string') {
          errorMessage = firstError;
        }
      }
      // Handle standard error message
      else if (errorData.message) {
        errorMessage = errorData.message;
      }
      // Handle error field
      else if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    
    // Handle specific HTTP status codes with user-friendly messages
    if (status === 400) {
      errorMessage = errorMessage || 'Invalid request. Please check your input and try again.';
    } else if (status === 401) {
      errorMessage = errorMessage || 'Authentication failed. Please check your credentials.';
    } else if (status === 403) {
      errorMessage = errorMessage || 'Access denied. You do not have permission to perform this action.';
    } else if (status === 404) {
      errorMessage = errorMessage || 'Resource not found. Please try again.';
    } else if (status === 422) {
      errorMessage = errorMessage || 'Validation failed. Please check your input.';
    } else if (status === 429) {
      errorMessage = 'Too many requests. Please wait a moment and try again.';
    } else if (status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (status === 503) {
      errorMessage = 'Service temporarily unavailable. Please try again later.';
    } else if (!error.response) {
      // Network error (no response from server)
      errorMessage = 'Network error. Please check your internet connection and try again.';
    }
    
    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
  
  // Handle non-Axios errors
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      message: error.message || 'An unexpected error occurred',
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
    message: 'An unexpected error occurred. Please try again.',
  };
};

