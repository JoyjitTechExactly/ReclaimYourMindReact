import apiClient from '../apiClient';
import { ApiResponse } from '../types';
import { handleError } from '../utils/errorHandler';
import { API_ENDPOINTS } from '../../constants/endpoints';

/**
 * Journal Entry Interface based on API response
 */
export interface JournalEntry {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reflection Entry Interface based on API response
 */
export interface ReflectionEntry {
  id: number;
  topic_title: string;
  phase_name: string;
  reflection_text: string;
  reflection_question: string | null;
  created_at: string;
}

/**
 * Journal Service
 * Handles all journal-related API calls
 */
class JournalService {
  /**
   * Get user journals
   * Endpoint: user/journals
   * Method: GET
   */
  async getJournals(): Promise<ApiResponse<JournalEntry[]>> {
    try {
      const response = await apiClient.get<ApiResponse<JournalEntry[]>>(API_ENDPOINTS.USER.JOURNALS);
      return response.data;
    } catch (error) {
      console.error('API Error in getJournals:', error);
      return handleError(error);
    }
  }

  /**
   * Create new journal entry
   * Endpoint: user/journals/store
   * Method: POST
   * @param content - The journal content
   */
  async createJournal(content: string): Promise<ApiResponse<JournalEntry>> {
    try {
      const response = await apiClient.post<ApiResponse<JournalEntry>>(API_ENDPOINTS.USER.STORE_JOURNAL, {
        content: content,
      });
      return response.data;
    } catch (error) {
      console.error('API Error in createJournal:', error);
      return handleError(error);
    }
  }

  /**
   * Get user reflections
   * Endpoint: user/reflections
   * Method: GET
   */
  async getReflections(): Promise<ApiResponse<ReflectionEntry[]>> {
    try {
      const response = await apiClient.get<ApiResponse<ReflectionEntry[]>>(API_ENDPOINTS.USER.REFLECTIONS);
      return response.data;
    } catch (error) {
      console.error('API Error in getReflections:', error);
      return handleError(error);
    }
  }

  /**
   * Delete journal entry
   * Endpoint: user/journals/{journalId}
   * Method: DELETE
   * @param journalId - The journal ID
   */
  async deleteJournal(journalId: number): Promise<ApiResponse<void>> {
    try {
      const endpoint = API_ENDPOINTS.USER.DELETE_JOURNAL(journalId);
      const response = await apiClient.delete<ApiResponse<void>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error in deleteJournal:', error);
      return handleError(error);
    }
  }

  /**
   * Update journal entry
   * Endpoint: user/journals/update
   * Method: PUT
   * @param journalId - The journal ID
   * @param content - The journal content
   */
  async updateJournal(journalId: number, content: string): Promise<ApiResponse<JournalEntry>> {
    try {
      const response = await apiClient.put<ApiResponse<JournalEntry>>(API_ENDPOINTS.USER.UPDATE_JOURNAL, {
        id: journalId,
        content: content,
      });
      return response.data;
    } catch (error) {
      console.error('API Error in updateJournal:', error);
      return handleError(error);
    }
  }

  /**
   * Download journal PDF
   * Endpoint: user/journals/{journalId}/pdf
   * Method: GET
   * @param journalId - The journal ID
   */
  async downloadJournalPDF(journalId: number): Promise<ApiResponse<{ pdf_url: string }>> {
    try {
      const endpoint = API_ENDPOINTS.USER.DOWNLOAD_JOURNAL_PDF(journalId);
      const response = await apiClient.get<ApiResponse<{ pdf_url: string }>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error in downloadJournalPDF:', error);
      return handleError(error);
    }
  }

  /**
   * Delete reflection entry
   * Endpoint: user/reflections/{reflectionId}
   * Method: DELETE
   * @param reflectionId - The reflection ID
   */
  async deleteReflection(reflectionId: number): Promise<ApiResponse<void>> {
    try {
      const endpoint = API_ENDPOINTS.USER.DELETE_REFLECTION(reflectionId);
      const response = await apiClient.delete<ApiResponse<void>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error in deleteReflection:', error);
      return handleError(error);
    }
  }

  /**
   * Update reflection entry
   * Endpoint: user/reflections/update
   * Method: PUT
   * @param reflectionId - The reflection ID
   * @param reflectionText - The reflection text
   */
  async updateReflection(reflectionId: number, reflectionText: string): Promise<ApiResponse<ReflectionEntry>> {
    try {
      const response = await apiClient.put<ApiResponse<ReflectionEntry>>(API_ENDPOINTS.USER.UPDATE_REFLECTION, {
        id: reflectionId,
        reflection_text: reflectionText,
      });
      return response.data;
    } catch (error) {
      console.error('API Error in updateReflection:', error);
      return handleError(error);
    }
  }

  /**
   * Download reflection PDF
   * Endpoint: user/reflections/{reflectionId}/pdf
   * Method: GET
   * @param reflectionId - The reflection ID
   */
  async downloadReflectionPDF(reflectionId: number): Promise<ApiResponse<{ pdf_url: string }>> {
    try {
      const endpoint = API_ENDPOINTS.USER.DOWNLOAD_REFLECTION_PDF(reflectionId);
      const response = await apiClient.get<ApiResponse<{ pdf_url: string }>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error in downloadReflectionPDF:', error);
      return handleError(error);
    }
  }
}

export default new JournalService();

