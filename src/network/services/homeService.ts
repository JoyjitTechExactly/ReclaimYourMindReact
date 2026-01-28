import apiClient from '../apiClient';
import { ApiResponse } from '../types';
import { handleError } from '../utils/errorHandler';
import { API_ENDPOINTS, buildEndpoint } from '../../constants/endpoints';

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
 * Reflection Answer Interface
 */
export interface ReflectionAnswer {
  id: number;
  topic_title: string;
  phase_name: string;
  reflection_text: string;
  reflection_question: string | null;
  created_at: string;
}

/**
 * Topic Details Response Interface
 */
export interface TopicDetailsResponse {
  sub_topic: {
    id: number;
    title: string;
    status: string | null;
    video_url: string[] | null;
    description: string;
    isSubTopicAvailable: boolean;
  };
  phase_name: string;
  phase_id: number;
  key_points: string;
  reflection_questions: string[] | null;
  reflection_answers: ReflectionAnswer[];
  next_topic_id: number | null;
  next_subphase_id: number | null;
  completed_topics: number;
  total_topics: number;
  sub_topic_name: string | null;
  sub_topic_id: number | null;
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
      const response = await apiClient.get<ApiResponse<Phase[]>>(API_ENDPOINTS.USER.PHASES);
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
      const endpoint = API_ENDPOINTS.USER.PHASE_WITH_CATEGORY(phaseId, categoryId);
      const response = await apiClient.get<ApiResponse<PhaseSubTopicsResponse>>(endpoint);
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
      const endpoint = API_ENDPOINTS.USER.PHASE(phaseId);
      const response = await apiClient.get<ApiResponse<PhaseTopicsResponse>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error in getPhaseTopics:', error);
      return handleError(error);
    }
  }

  /**
   * Get topic details
   * Endpoint: user/topic/{topicId}
   * Method: GET
   * @param topicId - The topic ID
   */
  async getTopicDetails(topicId: number): Promise<ApiResponse<TopicDetailsResponse>> {
    try {
      const endpoint = API_ENDPOINTS.USER.TOPIC(topicId);
      const response = await apiClient.get<ApiResponse<TopicDetailsResponse>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error in getTopicDetails:', error);
      return handleError(error);
    }
  }

  /**
   * Mark topic complete
   * Endpoint: user/progress
   * Method: POST
   * @param topic_id - The topic ID
   * @param phase_id - The phase ID
   * @param status - The status of the topic
   */
  async markTopicComplete(topicId: number, phaseId: number): Promise<ApiResponse<void>> {
    try {
      const endpoint = API_ENDPOINTS.USER.MARK_TOPIC_COMPLETE;
      const response = await apiClient.put<ApiResponse<void>>(endpoint, {
        topic_id: topicId,
        phase_id: phaseId,
        status: "Completed",
      });
      return response.data;
    } catch (error) {
      console.error('API Error in markTopicComplete:', error);
      return handleError(error);
    }
  }

  /**
   * Save reflection
   * Endpoint: user/reflections/store
   * Method: POST
   * @param topicId - The topic ID
   * @param reflection - The reflection text
   */
  async saveReflection(topicId: number, reflection: string): Promise<ApiResponse<ReflectionAnswer>> {
    try {
      const endpoint = API_ENDPOINTS.USER.SAVE_REFLECTION;
      const response = await apiClient.post<ApiResponse<ReflectionAnswer>>(endpoint, {
        topic_id: topicId,
        reflection_text: reflection,
      });
      return response.data;
    } catch (error) {
      console.error('API Error in saveReflection:', error);
      return handleError(error);
    }
  }

  /**
   * Download PDF
   * Endpoint: user/reflections/download-pdf
   * Method: GET
   * @param topicId - The topic ID
   */
  async downloadPDF(topicId: number): Promise<ApiResponse<void>> {
    try {
      const endpoint = API_ENDPOINTS.USER.DOWNLOAD_PDF(topicId);
      const response = await apiClient.get<ApiResponse<void>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error in downloadPDF:', error);
      return handleError(error);
    }
  }
}

export default new HomeService();

