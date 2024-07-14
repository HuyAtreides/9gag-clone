import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pagination } from '../../models/page';
import Post from '../../models/post';
import { SharedPost } from '../../models/shared-post';

interface SharedPostState {
  readonly sharedPost: SharedPost | null;
  readonly isLoading: boolean;
  readonly hasError: boolean;
}

interface PostState {
  readonly isLoading: boolean;
  readonly isGettingPage: boolean;
  readonly isSharingPost: boolean;
  readonly posts: Post[];
  readonly sharedPosts: Readonly<Record<number, SharedPostState>>;
  readonly pagination: Pagination | null;
  readonly errorMessage: string | null;
  readonly searchTerm?: string;
}

const initialState: PostState = {
  isGettingPage: false,
  isLoading: false,
  posts: [],
  sharedPosts: {},
  isSharingPost: false,
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

    togglePostFollowersOnly(
      state,
      action: PayloadAction<{ id: number; value: boolean }>,
    ) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      state.posts[index].followersOnly = action.payload.value;
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

    initSharedPostState(state, action: PayloadAction<number>) {
      const sharedPostContainerId = action.payload;
      state.sharedPosts[sharedPostContainerId] = {
        isLoading: true,
        sharedPost: null,
        hasError: false,
      };
    },

    setSharedPostIsLoading(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const { id, value } = action.payload;
      state.sharedPosts[id].isLoading = value;
    },

    setSharedPostContent(
      state,
      action: PayloadAction<{ id: number; value: SharedPost }>,
    ) {
      const { id, value } = action.payload;
      state.sharedPosts[id].sharedPost = value;
    },

    setSharedPostError(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const { id, value } = action.payload;
      state.sharedPosts[id].hasError = value;
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

    setPostAnonymous(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      const currentIsAnonymousState = state.posts[index].anonymous;
      state.posts[index].anonymous = !currentIsAnonymousState;
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

    setIsSharingPost(state, action: PayloadAction<boolean>) {
      state.isSharingPost = action.payload;
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
  setIsSharingPost,
  setPosts,
  setSharedPostError,
  setPagination,
  setSharedPostIsLoading,
  setSharedPostContent,
  appendNewPosts,
  setPostDownvotes,
  setPostUpvotes,
  setSearchTerm,
  resetState,
  initSharedPostState,
  removePost,
  setPostIsSaved,
  setPostFollowed,
  setSendNotifications,
  setPostAnonymous,
  togglePostFollowersOnly,
} = postSlice.actions;
export const postReducer = postSlice.reducer;
