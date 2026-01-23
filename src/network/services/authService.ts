import apiClient from '../apiClient';
import { ApiResponse, LoginRequest, SignUpRequest, SignUpResponseData, AuthResponse, VerifyOTPResponse } from '../types';
import { AxiosError } from 'axios';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Helper method to handle API errors and return standardized response
   * Extracts user-friendly error messages from API responses
   */
  private handleError(error: unknown): ApiResponse<any> {
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
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        credentials
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Sign up new user
   * Endpoint: auth/register
   * Method: POST
   * Request Body: { name, email, password, password_confirmation, terms_accepted }
   */
  async signUp(userData: SignUpRequest): Promise<ApiResponse<SignUpResponseData>> {
    try {
      const response = await apiClient.post<ApiResponse<SignUpResponseData>>(
        '/auth/register',
        userData
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('auth/logout');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ token: string }>>(
        '/auth/refresh',
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Forgot password - Send reset email
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        '/auth/forgot-password',
        { email }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email: string, otp: string): Promise<ApiResponse<VerifyOTPResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<VerifyOTPResponse>>(
        '/auth/otp-verification',
        { email, otp }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(
    email: string,
    token: string,
    password: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        '/auth/reset-password',
        { email: email, token: token, password: password, password_confirmation: password }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new AuthService();

