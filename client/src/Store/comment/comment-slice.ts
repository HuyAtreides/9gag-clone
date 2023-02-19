import AppComment from '../../models/comment';
import NewComment from '../../models/new-comment';
import { Pagination } from '../../models/page';
import { AppAction } from '../../utils/types/app-action';

export interface CommentState {
  readonly isLoading: boolean;
  readonly comments: AppComment[];
  readonly errorMessage: string | null;
  readonly isGettingNextPage: boolean;
  readonly pagination: Pagination | null;
  readonly commentSet: Set<number>;
  readonly isUploading: boolean;
}

export enum CommentActionType {
  SET_IS_LOADING,
  APPEND_COMMENTS,
  SET_ERROR_MESSAGE,
  SET_PAGINATION,
  SET_UPVOTES,
  SET_DOWNVOTES,
  ADD_REPLY,
  SET_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT,
}

export function getCommentInitialState() {
  return {
    isLoading: true,
    comments: [],
    errorMessage: null,
    commentSet: new Set<number>(),
    isGettingNextPage: false,
    isUploading: false,
    pagination: null,
  };
}

export function commentReducer(
  state: CommentState,
  action: AppAction<CommentActionType>,
): CommentState {
  const { type, payload } = action;
  const newState = { ...state };
  const comments = [...newState.comments];
  const commentSet = new Set<number>(state.commentSet);

  switch (type) {
    case CommentActionType.SET_COMMENT:
      const firstComments = payload as AppComment[];
      firstComments.forEach((value) => commentSet.add(value.id));
      newState.commentSet = commentSet;
      newState.comments = firstComments;

      return newState;

    case CommentActionType.DELETE_COMMENT:
      const deleteId = payload as number;
      commentSet.delete(deleteId);
      newState.comments = comments.filter((comment) => comment.id !== deleteId);
      newState.commentSet = commentSet;

      return newState;

    case CommentActionType.APPEND_COMMENTS:
      const newComments = payload as AppComment[];
      comments.push(...newComments.filter((value) => !commentSet.has(value.id)));

      newState.comments = comments;
      newComments.forEach((value) => {
        commentSet.add(value.id);
      });
      newState.commentSet = commentSet;

      return newState;

    case CommentActionType.SET_IS_LOADING:
      const isLoading = payload as boolean;
      newState.isLoading = isLoading;

      return newState;

    case CommentActionType.SET_PAGINATION:
      const pagination = payload as Pagination;
      newState.pagination = pagination;

      return newState;

    case CommentActionType.SET_ERROR_MESSAGE:
      const errorMessage = payload as string | null;
      newState.errorMessage = errorMessage;

      return newState;

    case CommentActionType.ADD_REPLY:
      const { reply, replyToId } = payload as { reply: AppComment; replyToId: number };
      const insertIndex =
        newState.comments.findIndex((comment) => comment.id === replyToId) + 1;
      comments.splice(insertIndex, 0, reply);
      newState.comments = comments;
      commentSet.add(reply.id);
      newState.commentSet = commentSet;

      return newState;

    case CommentActionType.UPDATE_COMMENT:
      const { updatedId, newComment } = payload as {
        updatedId: number;
        newComment: NewComment;
      };

      const commentIndex = state.comments.findIndex(
        (comment) => comment.id === updatedId,
      );

      comments[commentIndex] = new AppComment({
        ...comments[commentIndex],
        text: newComment.text,
        mediaType: newComment.mediaType,
        mediaUrl: newComment.mediaUrl,
      });
      newState.comments = comments;

      return newState;

    case CommentActionType.SET_DOWNVOTES:
      const [downvotedId, downvoteAmount] = payload as [number, 1 | -1];
      const downvotedIndex = state.comments.findIndex(
        (comment) => comment.id === downvotedId,
      );
      const currentDownvotes = comments[downvotedIndex].downvotes;
      comments[downvotedIndex] = new AppComment({
        ...comments[downvotedIndex],
        downvotes: currentDownvotes + downvoteAmount,
        isDownvoted: !comments[downvotedIndex].isDownvoted,
      });
      newState.comments = comments;

      return newState;

    case CommentActionType.SET_UPVOTES:
      const [upvotedId, upvoteAmount] = payload as [number, 1 | -1];

      const upvotedIndex = state.comments.findIndex(
        (comment) => comment.id === upvotedId,
      );
      const currentUpvotes = comments[upvotedIndex].upvotes;
      comments[upvotedIndex] = new AppComment({
        ...comments[upvotedIndex],
        upvotes: currentUpvotes + upvoteAmount,
        isUpvoted: !comments[upvotedIndex].isUpvoted,
      });
      newState.comments = comments;

      return newState;

    default:
      return state;
  }
}
