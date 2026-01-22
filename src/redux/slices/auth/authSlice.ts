import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../../network/services';
import { LoginRequest, SignUpRequest, AuthResponse, SignUpResponseData } from '../../../network/types';
import storage from '../../../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email?: string;
    name?: string;
    id?: number | string;
  } | null;
  token: string | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAccountCreationComplete: boolean;
  isRestoring: boolean; // Track if we're restoring auth state from storage
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  accessToken: null,
  isLoading: false,
  error: null,
  isAccountCreationComplete: false,
  isRestoring: true, // Start as true, will be set to false after restore completes
};

// Async Thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        // Store access_token in AsyncStorage
        await storage.setAccessToken(response.data.access_token);
        // Store user data
        await storage.setUser(response.data.user);
        
        // Return formatted data for Redux state
        return {
          access_token: response.data.access_token,
          token_type: response.data.token_type,
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
          },
        };
      }
      return rejectWithValue(response.error || response.message || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signUpAsync = createAsyncThunk(
  'auth/register',
  async (userData: SignUpRequest, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(userData);
      if (response.success && response.data) {
        // Store access_token in AsyncStorage
        await storage.setAccessToken(response.data.access_token);
        // Store user data
        await storage.setUser(response.data.user);
        
        // Return formatted data for Redux state
        return {
          access_token: response.data.access_token,
          token_type: response.data.token_type,
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
          },
        };
      }
      return rejectWithValue(response.error || response.message || 'Sign up failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      if (response.success) {
        return true;
      }
      return rejectWithValue(response.error || response.message || 'Logout failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    const response = await authService.forgotPassword(email);
    if (response.success) {
      return response.message || 'Password reset email sent';
    }
    return rejectWithValue(response.error || response.message || 'Failed to send reset email');
  }
);

export const verifyOTPAsync = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    const response = await authService.verifyOTP(email, otp);
    if (response.success) {
      return response.message || 'OTP verified successfully';
    }
    return rejectWithValue(response.error || response.message || 'OTP verification failed');
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (
    { email, otp, newPassword }: { email: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    const response = await authService.resetPassword(email, otp, newPassword);
    if (response.success) {
      return response.message || 'Password reset successfully';
    }
    return rejectWithValue(response.error || response.message || 'Password reset failed');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.isLoading = false;
      state.error = null;
      state.isAccountCreationComplete = false;
      // Clear AsyncStorage
      storage.clearAuthData().catch(console.error);
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setAccountCreationComplete: (state, action: PayloadAction<boolean>) => {
      state.isAccountCreationComplete = action.payload;
      // Store in AsyncStorage for persistence
      storage.setAccountCreationComplete(action.payload).catch(console.error);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email,
        };
        state.token = action.payload.access_token;
        state.accessToken = action.payload.access_token;
        state.isLoading = false;
        state.error = null;
        // For login, account creation is already complete (existing user)
        state.isAccountCreationComplete = true;
        // Store completion status
        storage.setAccountCreationComplete(true).catch(console.error);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.accessToken = null;
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign Up
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email,
        };
        state.token = action.payload.access_token;
        state.accessToken = action.payload.access_token;
        state.isLoading = false;
        state.error = null;
        // Account creation not complete yet - user needs to complete the journey flow
        state.isAccountCreationComplete = false;
        // Store completion status
        storage.setAccountCreationComplete(false).catch(console.error);
        // JourneyStart screen will be shown, and user will start journey from there
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.accessToken = null;
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.accessToken = null;
        state.isLoading = false;
        state.error = null;
        state.isAccountCreationComplete = false;
        // Clear AsyncStorage
        storage.clearAuthData().catch(console.error);
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Even if API call fails, logout locally
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.accessToken = null;
        state.isLoading = false;
        state.error = null;
        state.isAccountCreationComplete = false;
        // Clear AsyncStorage
        storage.clearAuthData().catch(console.error);
      });

    // Forgot Password
    builder
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify OTP
    builder
      .addCase(verifyOTPAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTPAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyOTPAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Restore Auth State
    builder
      .addCase(restoreAuthStateAsync.pending, (state) => {
        state.isRestoring = true;
      })
      .addCase(restoreAuthStateAsync.fulfilled, (state, action) => {
        state.isRestoring = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
          state.isAccountCreationComplete = action.payload.isAccountCreationComplete;
        }
      })
      .addCase(restoreAuthStateAsync.rejected, (state) => {
        state.isRestoring = false;
      });
  },
});

export const { logout, clearError, setToken, setAccountCreationComplete } = authSlice.actions;

// Thunk to restore auth state from storage on app startup
export const restoreAuthStateAsync = createAsyncThunk(
  'auth/restoreAuthState',
  async () => {
    try {
      const [accessToken, userString, isComplete] = await Promise.all([
        storage.getAccessToken(),
        storage.getUser(),
        storage.getAccountCreationComplete(),
      ]);

      if (accessToken && userString) {
        return {
          user: userString,
          token: accessToken,
          accessToken: accessToken,
          isAccountCreationComplete: isComplete,
        };
      }
      return null;
    } catch (error) {
      console.error('Error restoring auth state:', error);
      return null;
    }
  }
);

export default authSlice.reducer;
