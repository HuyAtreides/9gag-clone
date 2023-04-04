import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AppComment from '../../models/comment';
import NewComment from '../../models/new-comment';
import { Pagination } from '../../models/page';

interface CommentState {
  readonly comment: AppComment | null;
  readonly isLoading: boolean;
  readonly childrenId: number[];
  readonly isGettingNextPage: boolean;
  readonly pagination: Pagination | null;
  readonly errorMessage: null | string;
}

function getCommentInitialState(comment: AppComment | null) {
  return {
    isLoading: false,
    comment: comment,
    childrenId: [],
    errorMessage: null,
    isGettingNextPage: false,
    pagination: null,
  };
}

const initialState: Record<number, CommentState> = {
  0: getCommentInitialState(null),
};

const commentSlice = createSlice({
  name: 'comment',
  initialState: initialState,
  reducers: {
    addReply(state, action: PayloadAction<{ replyToId: number; reply: AppComment }>) {
      const { replyToId, reply } = action.payload;
      const parentId = reply.parentId || 0;
      const parentComment = state[parentId];
      state[reply.id] = getCommentInitialState(reply);

      const replyToIndex =
        parentComment.childrenId.findIndex((childId) => childId === replyToId) + 1;
      parentComment.childrenId.splice(replyToIndex, 0, reply.id);
    },

    updateCommentState(
      state,
      action: PayloadAction<{ id: number; newComment: NewComment }>,
    ) {
      const { id, newComment } = action.payload;
      const currentCommentState = state[id];
      const currentComment = currentCommentState.comment!;
      currentComment.text = newComment.text;
      currentComment.mediaType = newComment.mediaType;
      currentComment.mediaUrl = newComment.mediaUrl;
    },

    setCommentFollowed(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const { id, value } = action.payload;
      const currentComment = state[id].comment!;
      state[id].comment = new AppComment({
        ...currentComment,
        followed: value,
      });
    },

    setSendNotification(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const { id, value } = action.payload;
      const currentComment = state[id].comment!;
      state[id].comment = new AppComment({
        ...currentComment,
        notificationEnabled: value,
      });
    },

    appendChildren(
      state,
      action: PayloadAction<{ parentId: number; children: readonly AppComment[] }>,
    ) {
      const parentId = action.payload.parentId;
      const children = action.payload.children;
      const parentState = state[parentId];
      children.forEach((child) => {
        if (state[child.id] === undefined) {
          state[child.id] = getCommentInitialState(child);
          parentState.childrenId.push(child.id);
        }
      });
    },

    setChildren(
      state,
      action: PayloadAction<{ parentId: number; children: readonly AppComment[] }>,
    ) {
      const parentId = action.payload.parentId;
      const children = action.payload.children;
      const parentState = state[parentId];
      parentState.childrenId = children.map((child) => child.id);
      children.forEach((child) => {
        state[child.id] = getCommentInitialState(child);
      });
    },

    setIsLoading(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const commentId = action.payload.id;
      state[commentId].isLoading = action.payload.value;
    },

    setIsGettingNextPage(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const commentId = action.payload.id;
      state[commentId].isGettingNextPage = action.payload.value;
    },

    setErrorMessage(state, action: PayloadAction<string>) {
      state[0].errorMessage = action.payload;
    },

    setPagination(state, action: PayloadAction<{ id: number; value: Pagination }>) {
      const commentId = action.payload.id;
      state[commentId].pagination = action.payload.value;
    },

    setUpvotes(state, action: PayloadAction<{ id: number; value: 1 | -1 }>) {
      const commentId = action.payload.id;
      const currentComment = state[commentId].comment!;
      state[commentId].comment = new AppComment({
        ...currentComment,
        upvotes: currentComment.upvotes + action.payload.value,
        isUpvoted: !currentComment.isUpvoted,
      });
    },

    setDownvotes(state, action: PayloadAction<{ id: number; value: 1 | -1 }>) {
      const commentId = action.payload.id;
      const currentComment = state[commentId].comment!;
      state[commentId].comment = new AppComment({
        ...currentComment,
        downvotes: currentComment.downvotes + action.payload.value,
        isDownvoted: !currentComment.isDownvoted,
      });
    },

    deleteCommentState(state, action: PayloadAction<{ id: number }>) {
      const commentId = action.payload.id;
      const parentId = state[commentId].comment?.parentId || 0;
      const parent = state[parentId];
      const commentIndex = parent.childrenId.findIndex(
        (childId) => childId === commentId,
      );
      parent.childrenId.splice(commentIndex, 1);
      delete state[commentId];
    },

    resetState(state) {
      return initialState;
    },
  },
});

export const commentReducer = commentSlice.reducer;
export const {
  resetState,
  addReply,
  appendChildren,
  setChildren,
  setDownvotes,
  setErrorMessage,
  setIsGettingNextPage,
  setIsLoading,
  setPagination,
  setUpvotes,
  deleteCommentState,
  updateCommentState,
  setCommentFollowed,
  setSendNotification,
} = commentSlice.actions;
