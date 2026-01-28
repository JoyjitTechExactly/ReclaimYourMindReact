import apiClient from '../apiClient';
import { ApiResponse, AuthResponse } from '../types';
import { handleError } from '../utils/errorHandler';
import { API_ENDPOINTS } from '../../constants/endpoints';

/**
 * Profile Service
 * Handles all profile-related API calls
 */
class ProfileService {

  /**
   * Update user profile
   * Endpoint: user/manage-account
   * Method: PUT
   * Request Body: { name, email }
   */
  async updateProfile(profileData: { name: string; email: string }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.put<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.USER.MANAGE_ACCOUNT,
        profileData
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Change user password
   * Endpoint: user/manage-account/change-password
   * Method: POST
   * Request Body: { old_password, password, password_confirmation }
   */
  async changePassword(passwordData: { old_password: string; password: string; password_confirmation: string }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.USER.CHANGE_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Delete user account
   * Endpoint: user/delete-account
   * Method: DELETE
   */
  async deleteAccount(): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.delete<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.USER.MANAGE_ACCOUNT
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ProfileService();

