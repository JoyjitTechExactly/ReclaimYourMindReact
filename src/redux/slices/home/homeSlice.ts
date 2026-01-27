import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import homeService, { Phase, PhaseSubTopicsResponse, PhaseTopicsResponse } from '../../../network/services/homeService';

interface HomeState {
  phases: Phase[];
  isLoading: boolean;
  error: string | null;
  totalTopics: number;
  completedTopics: number;
  overallProgress: number;
  subTopics: PhaseSubTopicsResponse | null;
  phaseTopics: PhaseTopicsResponse | null;
  isLoadingSubTopics: boolean;
  subTopicsError: string | null;
}

const initialState: HomeState = {
  phases: [],
  isLoading: false,
  error: null,
  totalTopics: 0,
  completedTopics: 0,
  overallProgress: 0,
  subTopics: null,
  phaseTopics: null,
  isLoadingSubTopics: false,
  subTopicsError: null,
};

// Async Thunks
export const fetchPhasesAsync = createAsyncThunk(
  'home/fetchPhases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await homeService.getPhases();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || response.message || 'Failed to fetch phases');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch phases');
    }
  }
);

export const fetchPhaseSubTopicsAsync = createAsyncThunk(
  'home/fetchPhaseSubTopics',
  async ({ phaseId, categoryId }: { phaseId: number; categoryId: number }, { rejectWithValue }) => {
    try {
      console.log('fetchPhaseSubTopicsAsync called with:', { phaseId, categoryId });
      const response = await homeService.getPhaseSubTopics(phaseId, categoryId);
      console.log('API Response:', response);
      if (response.success && response.data) {
        return response.data;
      }
      const errorMsg = response.error || response.message || 'Failed to fetch subtopics';
      console.error('API Error:', errorMsg);
      return rejectWithValue(errorMsg);
    } catch (error: any) {
      console.error('Exception in fetchPhaseSubTopicsAsync:', error);
      return rejectWithValue(error.message || 'Failed to fetch subtopics');
    }
  }
);

export const fetchPhaseTopicsAsync = createAsyncThunk(
  'home/fetchPhaseTopics',
  async (phaseId: number, { rejectWithValue }) => {
    try {
      console.log('fetchPhaseTopicsAsync called with:', { phaseId });
      const response = await homeService.getPhaseTopics(phaseId);
      console.log('API Response:', response);
      if (response.success && response.data) {
        return response.data;
      }
      const errorMsg = response.error || response.message || 'Failed to fetch phase topics';
      console.error('API Error:', errorMsg);
      return rejectWithValue(errorMsg);
    } catch (error: any) {
      console.error('Exception in fetchPhaseTopicsAsync:', error);
      return rejectWithValue(error.message || 'Failed to fetch phase topics');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetHomeState: (state) => {
      state.phases = [];
      state.totalTopics = 0;
      state.completedTopics = 0;
      state.overallProgress = 0;
      state.error = null;
      state.subTopics = null;
      state.phaseTopics = null;
      state.subTopicsError = null;
    },
    clearSubTopics: (state) => {
      state.subTopics = null;
      state.subTopicsError = null;
    },
    clearPhaseTopics: (state) => {
      state.phaseTopics = null;
      state.subTopicsError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Phases
    builder
      .addCase(fetchPhasesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPhasesAsync.fulfilled, (state, action: PayloadAction<Phase[]>) => {
        state.isLoading = false;
        state.phases = action.payload;
        state.error = null;

        // Calculate totals and progress
        state.totalTopics = action.payload.reduce((sum, phase) => sum + phase.total_topics, 0);
        state.completedTopics = action.payload.reduce((sum, phase) => sum + phase.completed_topics, 0);
        state.overallProgress = state.totalTopics > 0 ? state.completedTopics / state.totalTopics : 0;
      })
      .addCase(fetchPhasesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Phase SubTopics
      .addCase(fetchPhaseSubTopicsAsync.pending, (state) => {
        state.isLoadingSubTopics = true;
        state.subTopicsError = null;
      })
      .addCase(fetchPhaseSubTopicsAsync.fulfilled, (state, action: PayloadAction<PhaseSubTopicsResponse>) => {
        state.isLoadingSubTopics = false;
        state.subTopics = action.payload;
        state.subTopicsError = null;
      })
      .addCase(fetchPhaseSubTopicsAsync.rejected, (state, action) => {
        state.isLoadingSubTopics = false;
        state.subTopicsError = action.payload as string;
      })
      // Fetch Phase Topics (without category)
      .addCase(fetchPhaseTopicsAsync.pending, (state) => {
        state.isLoadingSubTopics = true;
        state.subTopicsError = null;
      })
      .addCase(fetchPhaseTopicsAsync.fulfilled, (state, action: PayloadAction<PhaseTopicsResponse>) => {
        state.isLoadingSubTopics = false;
        state.phaseTopics = action.payload;
        state.subTopicsError = null;
      })
      .addCase(fetchPhaseTopicsAsync.rejected, (state, action) => {
        state.isLoadingSubTopics = false;
        state.subTopicsError = action.payload as string;
      });
  },
});

export const { clearError, resetHomeState, clearSubTopics, clearPhaseTopics } = homeSlice.actions;
export default homeSlice.reducer;

