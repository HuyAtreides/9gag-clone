import React from 'react';
import NewComment from '../../models/new-comment';
import { Pagination } from '../../models/page';
import PageOptions from '../../models/page-options';
import { CommentUploadFormData } from '../../models/upload-comment-form-data';
import {
  deleteComment,
  downvote,
  getComment,
  getPostChildrenComments,
  getPostComments,
  unDownvote,
  unUpvote,
  updateComment,
  uploadNewPostComment,
  uploadReply,
  upvote,
} from '../../services/comment-service';
import { handleError } from '../../utils/error-handler';
import { getMediaLocationFromForm } from '../../utils/get-media-location-from-form';
import { AppAction, AppActionCreator } from '../../utils/types/app-action';
import { CommentActionType, CommentState } from './comment-slice';

type Dispatcher = (
  state: CommentState,
  dispatch: React.Dispatch<AppAction<CommentActionType>>,
) => any;

export const errorMessageActionCreator: AppActionCreator = (value: string | null) => ({
  type: CommentActionType.SET_ERROR_MESSAGE,
  payload: value,
});

const getParentCommentPage = async (
  postId: number,
  pageOptions: PageOptions,
  dispatch: React.Dispatch<AppAction<CommentActionType>>,
) => {
  const commentPage = await getPostComments(postId, pageOptions);

  const pagination: Pagination = {
    size: commentPage.size,
    page: commentPage.page,
    isLast: commentPage.isLast,
    totalElements: commentPage.totalElements,
  };
  dispatch({ type: CommentActionType.SET_PAGINATION, payload: pagination });

  return commentPage;
};

export const getNextParentComment =
  (postId: number, pageOptions: PageOptions): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_IS_GETTING_NEXT_PAGE, payload: true });
      const commentPage = await getParentCommentPage(postId, pageOptions, dispatch);
      dispatch({ type: CommentActionType.SET_IS_GETTING_NEXT_PAGE, payload: false });
      dispatch({ type: CommentActionType.APPEND_COMMENTS, payload: commentPage.content });
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: false });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const deleteAppComment =
  (id: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.DELETE_COMMENT, payload: id });
      await deleteComment(id);
    } catch (error: unknown) {
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const getParentComment =
  (postId: number, pageOptions: PageOptions): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: true });
      const commentPage = await getParentCommentPage(postId, pageOptions, dispatch);
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: false });
      dispatch({ type: CommentActionType.APPEND_COMMENTS, payload: commentPage.content });
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: false });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const uploadComment =
  (commentUploadData: CommentUploadFormData, postId: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      const newComment = await getNewComment(commentUploadData);
      const id = await uploadNewPostComment(newComment, postId);
      const comment = await getComment(id);

      dispatch({
        type: CommentActionType.ADD_REPLY,
        payload: { reply: comment, replyToId: -1 },
      });
    } catch (error: unknown) {
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const getChildrenComment =
  (parentId: number, pageOptions: PageOptions): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: true });
      const commentPage = await getPostChildrenComments(parentId, pageOptions);

      const pagination: Pagination = {
        size: commentPage.size,
        page: commentPage.page,
        isLast: commentPage.isLast,
        totalElements: commentPage.totalElements,
      };
      dispatch({ type: CommentActionType.APPEND_COMMENTS, payload: commentPage.content });
      dispatch({ type: CommentActionType.SET_PAGINATION, payload: pagination });
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: false });
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: false });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const reply =
  (commentUploadData: CommentUploadFormData, replyToId: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      const newComment = await getNewComment(commentUploadData);
      const id = await uploadReply(newComment, replyToId);
      const comment = await getComment(id);
      dispatch({
        type: CommentActionType.ADD_REPLY,
        payload: { reply: comment, replyToId: replyToId },
      });
    } catch (error: unknown) {
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const upvoteComment =
  (id: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_UPVOTES, payload: [id, 1] });
      await upvote(id);
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_UPVOTES, payload: [id, -1] });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const unUpvoteComment =
  (id: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_UPVOTES, payload: [id, -1] });
      await unUpvote(id);
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_UPVOTES, payload: [id, 1] });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const update =
  (id: number, commentUploadData: CommentUploadFormData): Dispatcher =>
  async (state, dispatch) => {
    try {
      const currentComment = state.comments.find((comment) => comment.id === id)!;
      const isTextChanged = currentComment.text !== commentUploadData.text;
      const isMediaChanged = currentComment.mediaUrl !== commentUploadData.file?.url;

      if (isTextChanged || isMediaChanged) {
        const newComment = await getNewComment(commentUploadData);
        updateComment(id, newComment);
        dispatch({
          type: CommentActionType.UPDATE_COMMENT,
          payload: { updatedId: id, newComment: newComment },
        });
      }
    } catch (error: unknown) {
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const downvoteComment =
  (id: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_DOWNVOTES, payload: [id, 1] });
      await downvote(id);
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_DOWNVOTES, payload: [id, -1] });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const unDownvoteComment =
  (id: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_DOWNVOTES, payload: [id, -1] });
      await unDownvote(id);
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_DOWNVOTES, payload: [id, 1] });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };

export const getNewComment = async (
  commentUploadData: CommentUploadFormData,
): Promise<NewComment> => {
  const file = commentUploadData?.file;

  if (!file && !commentUploadData.text) {
    throw new Error('Please provide either text or media');
  }

  const mediaLocation = await getMediaLocationFromForm(file);

  return {
    text: commentUploadData.text || null,
    mediaType: mediaLocation.type,
    mediaUrl: mediaLocation.url,
  };
};

export const appendSingleComment =
  (id: number): Dispatcher =>
  async (state, dispatch) => {
    try {
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: true });
      const comment = await getComment(id);
      dispatch({ type: CommentActionType.APPEND_COMMENTS, payload: [comment] });
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: false });
    } catch (error: unknown) {
      dispatch({ type: CommentActionType.SET_IS_LOADING, payload: false });
      handleError(dispatch, error, errorMessageActionCreator);
    }
  };
