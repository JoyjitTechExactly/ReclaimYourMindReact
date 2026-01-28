/**
 * API Endpoints Constants
 * 
 * This file contains all API endpoint paths used throughout the application.
 * Centralizing endpoints makes it easier to maintain and update API routes.
 */

export const API_ENDPOINTS = {
  // Authentication Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/otp-verification',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User/Home Endpoints
  USER: {
    PHASES: 'user/phases',
    PHASE: (phaseId: number) => `user/phase/${phaseId}`,
    PHASE_WITH_CATEGORY: (phaseId: number, categoryId: number) => `user/phase/${phaseId}/${categoryId}`,
    TOPIC: (topicId: number) => `user/topic/${topicId}`,
    MANAGE_ACCOUNT: 'user/manage-account',
    CHANGE_PASSWORD: 'user/change-password',
    MARK_TOPIC_COMPLETE: 'user/progress',
    SAVE_REFLECTION: 'user/reflections/store',
    DOWNLOAD_PDF: (topicId: number) => `user/reflections/download-pdf/${topicId}`,
    JOURNALS: 'user/journals',
    STORE_JOURNAL: 'user/journals/store',
    REFLECTIONS: 'user/reflections',
    DELETE_JOURNAL: (journalId: number) => `user/journals/${journalId}`,
    UPDATE_JOURNAL: 'user/journals/update',
    DOWNLOAD_JOURNAL_PDF: (journalId: number) => `user/journals/${journalId}/pdf`,
    DELETE_REFLECTION: (reflectionId: number) => `user/reflections/${reflectionId}`,
    UPDATE_REFLECTION: 'user/reflections/update',
    DOWNLOAD_REFLECTION_PDF: (reflectionId: number) => `user/reflections/${reflectionId}/pdf`,
  },
} as const;

/**
 * Helper function to build dynamic endpoints
 * This ensures type safety and consistency when building endpoints with parameters
 */
export const buildEndpoint = {
  phase: (phaseId: number) => API_ENDPOINTS.USER.PHASE(phaseId),
  phaseWithCategory: (phaseId: number, categoryId: number) => 
    API_ENDPOINTS.USER.PHASE_WITH_CATEGORY(phaseId, categoryId),
  topic: (topicId: number) => API_ENDPOINTS.USER.TOPIC(topicId),
};

