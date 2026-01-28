import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import journalService, { JournalEntry, ReflectionEntry } from '../../../network/services/journalService';

interface JournalState {
  journals: JournalEntry[];
  reflections: ReflectionEntry[];
  isLoadingJournals: boolean;
  isLoadingReflections: boolean;
  journalsError: string | null;
  reflectionsError: string | null;
  isDeletingJournal: boolean;
  isUpdatingJournal: boolean;
  isCreatingJournal: boolean;
  isDownloadingJournalPDF: boolean;
  isDeletingReflection: boolean;
  isUpdatingReflection: boolean;
  isDownloadingReflectionPDF: boolean;
}

const initialState: JournalState = {
  journals: [],
  reflections: [],
  isLoadingJournals: false,
  isLoadingReflections: false,
  journalsError: null,
  reflectionsError: null,
  isDeletingJournal: false,
  isUpdatingJournal: false,
  isCreatingJournal: false,
  isDownloadingJournalPDF: false,
  isDeletingReflection: false,
  isUpdatingReflection: false,
  isDownloadingReflectionPDF: false,
};

// Async Thunks
export const fetchJournalsAsync = createAsyncThunk(
  'journal/fetchJournals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await journalService.getJournals();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || response.message || 'Failed to fetch journals');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch journals');
    }
  }
);

export const fetchReflectionsAsync = createAsyncThunk(
  'journal/fetchReflections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await journalService.getReflections();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || response.message || 'Failed to fetch reflections');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reflections');
    }
  }
);

export const createJournalAsync = createAsyncThunk(
  'journal/createJournal',
  async (content: string, { rejectWithValue }) => {
    try {
      const response = await journalService.createJournal(content);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || response.message || 'Failed to create journal');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create journal');
    }
  }
);

export const deleteJournalAsync = createAsyncThunk(
  'journal/deleteJournal',
  async (journalId: number, { rejectWithValue }) => {
    try {
      const response = await journalService.deleteJournal(journalId);
      if (response.success) {
        return journalId;
      }
      return rejectWithValue(response.error || response.message || 'Failed to delete journal');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete journal');
    }
  }
);

export const updateJournalAsync = createAsyncThunk(
  'journal/updateJournal',
  async ({ journalId, content }: { journalId: number; content: string }, { rejectWithValue }) => {
    try {
      const response = await journalService.updateJournal(journalId, content);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || response.message || 'Failed to update journal');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update journal');
    }
  }
);

export const downloadJournalPDFAsync = createAsyncThunk(
  'journal/downloadJournalPDF',
  async (journalId: number, { rejectWithValue }) => {
    try {
      const response = await journalService.downloadJournalPDF(journalId);
      if (response.success && response.data) {
        return { success: true, pdfUrl: response.data.pdf_url };
      }
      return rejectWithValue(response.error || response.message || 'Failed to download journal PDF');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to download journal PDF');
    }
  }
);

export const deleteReflectionAsync = createAsyncThunk(
  'journal/deleteReflection',
  async (reflectionId: number, { rejectWithValue }) => {
    try {
      const response = await journalService.deleteReflection(reflectionId);
      if (response.success) {
        return reflectionId;
      }
      return rejectWithValue(response.error || response.message || 'Failed to delete reflection');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete reflection');
    }
  }
);

export const updateReflectionAsync = createAsyncThunk(
  'journal/updateReflection',
  async ({ reflectionId, reflectionText }: { reflectionId: number; reflectionText: string }, { rejectWithValue }) => {
    try {
      const response = await journalService.updateReflection(reflectionId, reflectionText);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || response.message || 'Failed to update reflection');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update reflection');
    }
  }
);

export const downloadReflectionPDFAsync = createAsyncThunk(
  'journal/downloadReflectionPDF',
  async (reflectionId: number, { rejectWithValue }) => {
    try {
      const response = await journalService.downloadReflectionPDF(reflectionId);
      if (response.success && response.data) {
        return { success: true, pdfUrl: response.data.pdf_url };
      }
      return rejectWithValue(response.error || response.message || 'Failed to download reflection PDF');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to download reflection PDF');
    }
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearJournalsError: (state) => {
      state.journalsError = null;
    },
    clearReflectionsError: (state) => {
      state.reflectionsError = null;
    },
    clearJournalState: (state) => {
      state.journals = [];
      state.reflections = [];
      state.journalsError = null;
      state.reflectionsError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Journals
    builder
      .addCase(fetchJournalsAsync.pending, (state) => {
        state.isLoadingJournals = true;
        state.journalsError = null;
      })
      .addCase(fetchJournalsAsync.fulfilled, (state, action: PayloadAction<JournalEntry[]>) => {
        state.isLoadingJournals = false;
        state.journals = action.payload;
        state.journalsError = null;
      })
      .addCase(fetchJournalsAsync.rejected, (state, action) => {
        state.isLoadingJournals = false;
        state.journalsError = action.payload as string;
      })
      // Fetch Reflections
      .addCase(fetchReflectionsAsync.pending, (state) => {
        state.isLoadingReflections = true;
        state.reflectionsError = null;
      })
      .addCase(fetchReflectionsAsync.fulfilled, (state, action: PayloadAction<ReflectionEntry[]>) => {
        state.isLoadingReflections = false;
        state.reflections = action.payload;
        state.reflectionsError = null;
      })
      .addCase(fetchReflectionsAsync.rejected, (state, action) => {
        state.isLoadingReflections = false;
        state.reflectionsError = action.payload as string;
      })
      // Create Journal
      .addCase(createJournalAsync.pending, (state) => {
        state.isCreatingJournal = true;
        state.journalsError = null;
      })
      .addCase(createJournalAsync.fulfilled, (state, action: PayloadAction<JournalEntry>) => {
        state.isCreatingJournal = false;
        state.journals.unshift(action.payload); // Add new journal at the beginning
        state.journalsError = null;
      })
      .addCase(createJournalAsync.rejected, (state, action) => {
        state.isCreatingJournal = false;
        state.journalsError = action.payload as string;
      })
      // Delete Journal
      .addCase(deleteJournalAsync.pending, (state) => {
        state.isDeletingJournal = true;
      })
      .addCase(deleteJournalAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isDeletingJournal = false;
        state.journals = state.journals.filter((journal) => journal.id !== action.payload);
      })
      .addCase(deleteJournalAsync.rejected, (state) => {
        state.isDeletingJournal = false;
      })
      // Update Journal
      .addCase(updateJournalAsync.pending, (state) => {
        state.isUpdatingJournal = true;
      })
      .addCase(updateJournalAsync.fulfilled, (state, action: PayloadAction<JournalEntry>) => {
        state.isUpdatingJournal = false;
        const index = state.journals.findIndex((journal) => journal.id === action.payload.id);
        if (index >= 0) {
          state.journals[index] = action.payload;
        }
      })
      .addCase(updateJournalAsync.rejected, (state) => {
        state.isUpdatingJournal = false;
      })
      // Download Journal PDF
      .addCase(downloadJournalPDFAsync.pending, (state) => {
        state.isDownloadingJournalPDF = true;
      })
      .addCase(downloadJournalPDFAsync.fulfilled, (state) => {
        state.isDownloadingJournalPDF = false;
      })
      .addCase(downloadJournalPDFAsync.rejected, (state) => {
        state.isDownloadingJournalPDF = false;
      })
      // Delete Reflection
      .addCase(deleteReflectionAsync.pending, (state) => {
        state.isDeletingReflection = true;
      })
      .addCase(deleteReflectionAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isDeletingReflection = false;
        state.reflections = state.reflections.filter((reflection) => reflection.id !== action.payload);
      })
      .addCase(deleteReflectionAsync.rejected, (state) => {
        state.isDeletingReflection = false;
      })
      // Update Reflection
      .addCase(updateReflectionAsync.pending, (state) => {
        state.isUpdatingReflection = true;
      })
      .addCase(updateReflectionAsync.fulfilled, (state, action: PayloadAction<ReflectionEntry>) => {
        state.isUpdatingReflection = false;
        const index = state.reflections.findIndex((reflection) => reflection.id === action.payload.id);
        if (index >= 0) {
          state.reflections[index] = action.payload;
        }
      })
      .addCase(updateReflectionAsync.rejected, (state) => {
        state.isUpdatingReflection = false;
      })
      // Download Reflection PDF
      .addCase(downloadReflectionPDFAsync.pending, (state) => {
        state.isDownloadingReflectionPDF = true;
      })
      .addCase(downloadReflectionPDFAsync.fulfilled, (state) => {
        state.isDownloadingReflectionPDF = false;
      })
      .addCase(downloadReflectionPDFAsync.rejected, (state) => {
        state.isDownloadingReflectionPDF = false;
      });
  },
});

export const { clearJournalsError, clearReflectionsError, clearJournalState } = journalSlice.actions;
export default journalSlice.reducer;

