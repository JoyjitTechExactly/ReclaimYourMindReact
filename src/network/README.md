# API Integration Setup

This directory contains the API integration layer with service-based architecture and Redux async thunks.

## Structure

```
src/network/
├── apiClient.ts          # Axios instance with interceptors
├── config.ts            # API configuration
├── types.ts             # TypeScript types for API responses
├── services/            # Service layer for API calls
│   ├── authService.ts   # Authentication service
│   └── index.ts         # Service exports
└── README.md            # This file
```

## Features

1. **Bearer Token Interceptor**: Automatically adds Bearer token from Redux store to all requests
2. **Request/Response Logging**: Logs all API requests and responses (only in development mode)
3. **Service Layer**: Separated API logic from Redux slices
4. **Async Thunks**: Redux Toolkit async thunks for handling async operations
5. **Error Handling**: Centralized error handling with proper error messages

## Configuration

Update `src/network/config.ts` with your API base URL:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-api-url.com',
  TIMEOUT: 30000,
  ENABLE_LOGGING: __DEV__,
};
```

## Usage Example

### In a Component

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../redux/slices/auth/authSlice';
import { AppDispatch } from '../redux/store';

const MyComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(loginAsync({ email: 'user@example.com', password: 'password' })).unwrap();
      // Login successful - navigation handled automatically
    } catch (err) {
      // Error is already set in Redux state
      console.error('Login failed:', err);
    }
  };

  return (
    // Your component JSX
  );
};
```

### Creating a New Service

1. Create a new service file in `src/network/services/`:

```typescript
// src/network/services/userService.ts
import apiClient from '../apiClient';
import { ApiResponse } from '../types';

class UserService {
  async getUserProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile');
    return response.data;
  }
}

export default new UserService();
```

2. Export it from `src/network/services/index.ts`:

```typescript
export { default as userService } from './userService';
```

3. Create async thunk in your slice:

```typescript
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch profile');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);
```

## Logging

All API requests and responses are automatically logged in development mode. The logs include:
- Request URL, method, headers, params, and body
- Response status, headers, and data
- Error details for failed requests

These logs appear in your React Native debugger console and can be viewed in:
- React Native Debugger
- Chrome DevTools (when using remote debugging)
- Metro bundler console

## Bearer Token

The Bearer token is automatically added to all requests from the Redux store (`state.auth.token`). No manual token management is needed in your services or components.

