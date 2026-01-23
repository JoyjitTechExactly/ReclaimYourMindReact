import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appService } from '../../../network/services';
import storage from '../../../utils/storage';

interface ProfileState {
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  success: boolean;
}

const initialState: ProfileState = {
  isLoading: false,
  error: null,
  isUpdating: false,
  success: false,
};

// Async Thunks
export const updateProfileAsync = createAsyncThunk(
  'profile/updateProfile',
  async (
    { name, email }: { name: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await appService.updateProfile({ name, email });
      if (response.success && response.data) {
        // Store updated access_token in AsyncStorage
        await storage.setAccessToken(response.data.access_token);
        // Store updated user data
        await storage.setUser(response.data.user);
        
        // Return formatted data for updating auth state
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
      return rejectWithValue(response.error || response.message || 'Profile update failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    updateAuthUser: (state, action: PayloadAction<{ user: { id: number | string; name: string; email: string }; access_token: string }>) => {
      // This action will be dispatched from auth slice listener
      // Just clear any errors on successful auth update
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Update Profile
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.isUpdating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfileAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isUpdating = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isUpdating = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, updateAuthUser } = profileSlice.actions;
export default profileSlice.reducer;

