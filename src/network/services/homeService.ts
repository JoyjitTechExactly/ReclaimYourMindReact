import apiClient from '../apiClient';
import { ApiResponse } from '../types';
import { handleError } from '../utils/errorHandler';

/**
 * Phase Interface based on API response
 */
export interface Phase {
  id: number;
  name: string;
  description: string;
  status: string | null;
  total_topics: number;
  image_url: string;
  completed_topics: number;
  isSubPhaseAvailable: boolean;
  isVersionTabAvailable: boolean;
}

/**
 * SubTopic Interface based on API response
 */
export interface SubTopic {
  id: number;
  title: string;
  status: string | null;
  video_url: string[] | null;
  description: string;
  isSubTopicAvailable: boolean;
}

/**
 * Phase SubTopics Response Interface (for category/subtopic)
 */
export interface PhaseSubTopicsResponse {
  subtopics: SubTopic[];
  parent_name: string;
  phase_name: string;
  total_topics: number;
  completed_topics: number;
  parent_id: number;
}

/**
 * Version Info Interface
 */
export interface VersionInfo {
  id: number;
  version_name: string;
}

/**
 * Action Category Interface (for Action phase categories)
 */
export interface ActionCategory {
  id: number;
  title: string;
  description: string;
  total_topics: number;
  completed_topics: number;
  status: string | null;
}

/**
 * Phase Topics Response Interface (for phase topics without category)
 * For Acceptance: topics.data_1 and topics.data_2 contain SubTopic arrays
 * For Action: topics.data_1 contains ActionCategory array, topics.data_2 is null
 */
export interface PhaseTopicsResponse {
  phase_name: string;
  phase_description: string;
  phase_id: number;
  extra_videos: string[] | null;
  completed_topics: number;
  total_topics: number;
  isSubPhaseAvailable: boolean;
  isVersionTabAvailable: boolean;
  version?: {
    version_1: VersionInfo | null;
    version_2: VersionInfo | null;
  };
  topics: {
    data_1: SubTopic[] | ActionCategory[]; // Topics for Acceptance, Categories for Action
    data_2: SubTopic[] | null; // Adapter topics for Acceptance, null for Action
  };
}

/**
 * Home Service
 * Handles all home-related API calls
 */
class HomeService {
  /**
   * Get user phases
   * Endpoint: user/phases
   * Method: GET
   */
  async getPhases(): Promise<ApiResponse<Phase[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Phase[]>>('user/phases');
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Get phase subtopics for a category (when categoryId is present)
   * Endpoint: user/phase/{phaseId}/{categoryId}
   * Method: GET
   * @param phaseId - The phase ID
   * @param categoryId - The category/parent ID
   */
  async getPhaseSubTopics(phaseId: number, categoryId: number): Promise<ApiResponse<PhaseSubTopicsResponse>> {
    try {
      const endpoint = `user/phase/${phaseId}/${categoryId}`;
      console.log('Calling API endpoint (with category):', endpoint);
      const response = await apiClient.get<ApiResponse<PhaseSubTopicsResponse>>(endpoint);
      console.log('API Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error in getPhaseSubTopics:', error);
      return handleError(error);
    }
  }

  /**
   * Get phase topics (when only phaseId is available, no categoryId)
   * Endpoint: user/phase/{phaseId}
   * Method: GET
   * @param phaseId - The phase ID
   */
  async getPhaseTopics(phaseId: number): Promise<ApiResponse<PhaseTopicsResponse>> {
    try {
      const endpoint = `user/phase/${phaseId}`;
      console.log('Calling API endpoint (phase only):', endpoint);
      const response = await apiClient.get<ApiResponse<PhaseTopicsResponse>>(endpoint);
      console.log('API Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error in getPhaseTopics:', error);
      return handleError(error);
    }
  }
}

export default new HomeService();

