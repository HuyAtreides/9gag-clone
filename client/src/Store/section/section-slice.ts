import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Section from '../../models/section';

export interface SectionState {
  readonly isLoading: boolean;
  readonly sections: Section[];
  readonly errorMessage: string | null;
}

const initialState: SectionState = {
  isLoading: false,
  sections: [],
  errorMessage: null,
};

const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSections(state, action: PayloadAction<Section[]>) {
      state.sections = action.payload;
    },
    setUserErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  },
});

export const sectionReducer = sectionSlice.reducer;
export const { setIsLoading, setSections, setUserErrorMessage } = sectionSlice.actions;
