import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pagination } from '../../models/page';
import Post from '../../models/post';

interface PostState {
  readonly isLoading: boolean;
  readonly isGettingPage: boolean;
  readonly posts: Post[] | null;
  readonly pagination: Pagination | null;
  readonly errorMessage: string | null;
}

const initialState: PostState = {
  isGettingPage: false,
  isLoading: true,
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

    setPostUpvotes(state, action: PayloadAction<[number, 1 | -1]>) {
      const index = action.payload[0];
      const amount = action.payload[1];

      state.posts![index].upvotes += amount;
    },

    setPostDownvotes(state, action: PayloadAction<[number, 1 | -1]>) {
      const index = action.payload[0];
      const amount = action.payload[1];

      state.posts![index].downvotes += amount;
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
  setPostDownvotes,
  setPostUpvotes,
} = postSlice.actions;
export const postReducer = postSlice.reducer;
