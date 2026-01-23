// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  errors?: Record<string, string[]>;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: string; // "1" for accepted
}

export interface SignUpResponseData {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number | string;
    email: string;
    name: string;
  };
  token?: string; // Legacy support
  refreshToken?: string;
}

export interface VerifyOTPResponse {
  verified: boolean;
  email: string;
  expires_at: string;
  remaining_minutes: string;
  token: string;
}

