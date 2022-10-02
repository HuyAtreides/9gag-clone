import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pagination } from '../../models/page';
import Post from '../../models/post';
import Slice from '../../models/slice';

interface PostState {
  readonly isLoading: boolean;
  readonly isGettingPage: boolean;
  readonly post: Post | null;
  readonly posts: Post[] | null;
  readonly pagination: Pagination | null;
  readonly errorMessage: string | null;
}

const initialState: PostState = {
  isGettingPage: false,
  isLoading: true,
  post: null,
  posts: null,
  pagination: null,
  errorMessage: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setIsGettingPage(state, action: PayloadAction<boolean>) {
      state.isGettingPage = action.payload;
    },

    setPostErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },

    setPagination(state, action: PayloadAction<Pagination | null>) {
      state.pagination = action.payload;
    },

    setPosts(state, action: PayloadAction<readonly Post[] | null>) {
      state.posts = action.payload ? action.payload.map((post) => post) : action.payload;
    },

    appendNewPosts(state, action: PayloadAction<readonly Post[]>) {
      state.posts?.push(...action.payload);
    },
  },
});

export const {
  setIsLoading,
  setIsGettingPage,
  setPostErrorMessage,
  setPosts,
  setPagination,
  appendNewPosts,
} = postSlice.actions;
export const postReducer = postSlice.reducer;
