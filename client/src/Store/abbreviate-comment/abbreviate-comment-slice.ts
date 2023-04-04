import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AppComment from '../../models/comment';
import { Pagination } from '../../models/page';

interface AbbreviateCommentState {
  readonly isGettingComments: boolean;
  readonly isGettingNextComments: boolean;
  readonly comments: AppComment[];
  readonly pagination: Pagination | null;
  readonly errorMessage: string | null;
}

const initialState: AbbreviateCommentState = {
  isGettingComments: false,
  isGettingNextComments: false,
  comments: [],
  pagination: null,
  errorMessage: null,
};

const abbreviateCommentSlice = createSlice({
  name: 'abbreviateComment',
  initialState,
  reducers: {
    appendComments(state, action: PayloadAction<readonly AppComment[]>) {
      state.comments.push(...action.payload);
    },
    setIsGettingComments(state, action: PayloadAction<boolean>) {
      state.isGettingComments = action.payload;
    },

    setIsGettingNextComments(state, action: PayloadAction<boolean>) {
      state.isGettingNextComments = action.payload;
    },

    resetState() {
      return initialState;
    },

    setPagination(state, action: PayloadAction<Pagination | null>) {
      state.pagination = action.payload;
    },

    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  },
});

export const abbreviateCommentReducer = abbreviateCommentSlice.reducer;
export const {
  setIsGettingComments,
  setIsGettingNextComments,
  appendComments,
  resetState,
  setPagination,
  setErrorMessage,
} = abbreviateCommentSlice.actions;
