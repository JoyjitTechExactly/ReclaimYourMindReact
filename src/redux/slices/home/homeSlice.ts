import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import homeService, { Phase, PhaseSubTopicsResponse, PhaseTopicsResponse, TopicDetailsResponse, ReflectionAnswer } from '../../../network/services/homeService';

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
  topicDetails: TopicDetailsResponse | null;
  isLoadingTopicDetails: boolean;
  topicDetailsError: string | null;
  isSavingReflection: boolean;
  isDownloadingPDF: boolean;
  isMarkingComplete: boolean;
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
  topicDetails: null,
  isLoadingTopicDetails: false,
  topicDetailsError: null,
  isSavingReflection: false,
  isDownloadingPDF: false,
  isMarkingComplete: false,
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

export const fetchTopicDetailsAsync = createAsyncThunk(
  'home/fetchTopicDetails',
  async (topicId: number, { rejectWithValue }) => {
    try {
      console.log('fetchTopicDetailsAsync called with:', { topicId });
      const response = await homeService.getTopicDetails(topicId);
      console.log('API Response:', response);
      if (response.success && response.data) {
        return response.data;
      }
      const errorMsg = response.error || response.message || 'Failed to fetch topic details';
      console.error('API Error:', errorMsg);
      return rejectWithValue(errorMsg);
    } catch (error: any) {
      console.error('Exception in fetchTopicDetailsAsync:', error);
      return rejectWithValue(error.message || 'Failed to fetch topic details');
    }
  }
);

export const saveReflectionAsync = createAsyncThunk(
  'home/saveReflection',
  async ({ topicId, reflection }: { topicId: number; reflection: string }, { rejectWithValue }) => {
    try {
      const response = await homeService.saveReflection(topicId, reflection);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || response.message || 'Failed to save reflection');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save reflection');
    }
  }
);

export const downloadPDFAsync = createAsyncThunk(
  'home/downloadPDF',
  async (topicId: number, { rejectWithValue }) => {
    try {
      const response = await homeService.downloadPDF(topicId);
      if (response.success) {
        return { success: true, data: response.data };
      }
      return rejectWithValue(response.error || response.message || 'Failed to download PDF');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to download PDF');
    }
  }
);

export const markTopicCompleteAsync = createAsyncThunk(
  'home/markTopicComplete',
  async ({ topicId, phaseId }: { topicId: number; phaseId: number }, { rejectWithValue }) => {
    try {
      const response = await homeService.markTopicComplete(topicId, phaseId);
      if (response.success) {
        return { success: true };
      }
      return rejectWithValue(response.error || response.message || 'Failed to mark topic as complete');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark topic as complete');
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
    clearTopicDetails: (state) => {
      state.topicDetails = null;
      state.topicDetailsError = null;
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
      })
      // Fetch Topic Details
      .addCase(fetchTopicDetailsAsync.pending, (state) => {
        state.isLoadingTopicDetails = true;
        state.topicDetailsError = null;
      })
      .addCase(fetchTopicDetailsAsync.fulfilled, (state, action: PayloadAction<TopicDetailsResponse>) => {
        state.isLoadingTopicDetails = false;
        state.topicDetails = action.payload;
        state.topicDetailsError = null;
      })
      .addCase(fetchTopicDetailsAsync.rejected, (state, action) => {
        state.isLoadingTopicDetails = false;
        state.topicDetailsError = action.payload as string;
      })
      // Save Reflection
      .addCase(saveReflectionAsync.pending, (state) => {
        state.isSavingReflection = true;
      })
      .addCase(saveReflectionAsync.fulfilled, (state, action: PayloadAction<ReflectionAnswer>) => {
        state.isSavingReflection = false;
        // Update topicDetails with the new reflection answer
        if (state.topicDetails) {
          // Check if reflection_answers exists, if not initialize it
          if (!state.topicDetails.reflection_answers) {
            state.topicDetails.reflection_answers = [];
          }
          // Check if this reflection already exists (by id) and update it, otherwise add it
          const existingIndex = state.topicDetails.reflection_answers.findIndex(
            (answer) => answer.id === action.payload.id
          );
          if (existingIndex >= 0) {
            // Update existing reflection
            state.topicDetails.reflection_answers[existingIndex] = action.payload;
          } else {
            // Add new reflection to the array
            state.topicDetails.reflection_answers.push(action.payload);
          }
        }
      })
      .addCase(saveReflectionAsync.rejected, (state) => {
        state.isSavingReflection = false;
      })
      // Download PDF
      .addCase(downloadPDFAsync.pending, (state) => {
        state.isDownloadingPDF = true;
      })
      .addCase(downloadPDFAsync.fulfilled, (state) => {
        state.isDownloadingPDF = false;
      })
      .addCase(downloadPDFAsync.rejected, (state) => {
        state.isDownloadingPDF = false;
      })
      // Mark Topic Complete
      .addCase(markTopicCompleteAsync.pending, (state) => {
        state.isMarkingComplete = true;
      })
      .addCase(markTopicCompleteAsync.fulfilled, (state) => {
        state.isMarkingComplete = false;
      })
      .addCase(markTopicCompleteAsync.rejected, (state) => {
        state.isMarkingComplete = false;
      });
  },
});

export const { clearError, resetHomeState, clearSubTopics, clearPhaseTopics, clearTopicDetails } = homeSlice.actions;
export default homeSlice.reducer;

