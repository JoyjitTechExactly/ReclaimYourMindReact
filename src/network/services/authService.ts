import apiClient from '../apiClient';
import { ApiResponse, LoginRequest, SignUpRequest, SignUpResponseData, AuthResponse, VerifyOTPResponse } from '../types';
import { handleError } from '../utils/errorHandler';
import { API_ENDPOINTS } from '../../constants/endpoints';

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
        API_ENDPOINTS.AUTH.LOGIN,
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
        API_ENDPOINTS.AUTH.REGISTER,
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
      const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT);
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
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
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
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
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
        API_ENDPOINTS.AUTH.VERIFY_OTP,
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
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { email: email, token: token, password: password, password_confirmation: password }
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new AuthService();

