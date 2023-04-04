import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pagination } from '../../models/page';
import Post from '../../models/post';

interface PostState {
  readonly isLoading: boolean;
  readonly isGettingPage: boolean;
  readonly posts: Post[];
  readonly pagination: Pagination | null;
  readonly errorMessage: string | null;
  readonly searchTerm?: string;
}

const initialState: PostState = {
  isGettingPage: false,
  isLoading: false,
  posts: [],
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

    setPosts(state, action: PayloadAction<readonly Post[]>) {
      state.posts = action.payload ? action.payload.map((post) => post) : action.payload;
    },

    appendNewPosts(state, action: PayloadAction<readonly Post[]>) {
      state.posts?.push(...action.payload);
    },

    removePost(state, action: PayloadAction<Post>) {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },

    setPostUpvotes(state, action: PayloadAction<[Post, 1 | -1]>) {
      const updatedPost = action.payload[0];
      const amount = action.payload[1];
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      const post = state.posts[index];
      post.isUpvoted = !post.isUpvoted;
      post.upvotes += amount;
    },

    setPostFollowed(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      const currentIsFollowedState = state.posts[index].followed;
      state.posts[index].followed = !currentIsFollowedState;
    },

    setSendNotifications(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      const currentSendNotification = state.posts[index].notificationEnabled;
      state.posts[index].notificationEnabled = !currentSendNotification;
    },

    setPostDownvotes(state, action: PayloadAction<[Post, 1 | -1]>) {
      const updatedPost = action.payload[0];
      const amount = action.payload[1];
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      const post = state.posts![index];
      post.isDownvoted = !post.isDownvoted;
      post.downvotes += amount;
    },

    setPostIsSaved(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      const currentIsSavedState = state.posts[index].isSaved;
      state.posts[index].isSaved = !currentIsSavedState;
    },

    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload.length ? action.payload : undefined;
    },

    resetState(state) {
      return initialState;
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
  setSearchTerm,
  resetState,
  removePost,
  setPostIsSaved,
  setPostFollowed,
  setSendNotifications,
} = postSlice.actions;
export const postReducer = postSlice.reducer;
