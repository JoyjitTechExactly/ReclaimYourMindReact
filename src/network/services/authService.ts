import apiClient from '../apiClient';
import { ApiResponse, LoginRequest, SignUpRequest, SignUpResponseData, AuthResponse, VerifyOTPResponse } from '../types';
import { handleError } from '../utils/errorHandler';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
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
      return handleError(error);
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
      return handleError(error);
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
      return handleError(error);
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
      return handleError(error);
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
      return handleError(error);
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
      return handleError(error);
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
      return handleError(error);
    }
  }
}

export default new AuthService();

