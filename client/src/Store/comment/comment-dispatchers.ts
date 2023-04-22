import { message } from 'antd';
import { AppThunk } from '..';
import NewComment from '../../models/new-comment';
import { Pagination } from '../../models/page';
import { FetchChildrenCommentRequest } from '../../models/requests/fetch-children-comment-request';
import { FetchCommentRequest } from '../../models/requests/fetch-comment-request';
import { FetchPostCommentRequest } from '../../models/requests/fetch-post-comment-request';
import { CommentUploadFormData } from '../../models/upload-comment-form-data';
import {
  deleteComment,
  downvote,
  FetchCommentPageFunc,
  followComment,
  getComment,
  getPostChildrenComments,
  getPostComments,
  turnOffCommentNotification,
  turnOnCommentNotifications,
  unDownvote,
  unFollowComment,
  unUpvote,
  updateComment,
  uploadNewPostComment,
  uploadReply,
  upvote,
} from '../../services/comment-service';
import { handleError } from '../../utils/error-handler';
import { getMediaLocationFromForm } from '../../utils/get-media-location-from-form';
import {
  addReply,
  appendChildren,
  deleteCommentState,
  setCommentFollowed,
  setDownvotes,
  setErrorMessage,
  setIsGettingNextPage,
  setIsLoading,
  setPagination,
  setSendNotification,
  setUpvotes,
  updateCommentState,
} from './comment-slice';

export const getCommentPageDispatcher =
  <T extends FetchCommentRequest>(
    request: T,
    fetchFunc: FetchCommentPageFunc<T>,
    id: number,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading({ id, value: true }));
      await dispatch(getPriorityComments(id, request.priorityIds));

      const commentPage = await fetchFunc(request);

      const pagination: Pagination = {
        size: commentPage.size,
        page: commentPage.page,
        isLast: commentPage.isLast,
      };

      dispatch(setIsLoading({ id, value: false }));
      dispatch(setPagination({ id, value: pagination }));
      dispatch(appendChildren({ parentId: id, children: commentPage.content }));
    } catch (error: unknown) {
      dispatch(setIsLoading({ id, value: false }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const appendCommentPageDispatcher =
  <T extends FetchCommentRequest>(
    request: T,
    fetchFunc: FetchCommentPageFunc<T>,
    id: number,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingNextPage({ id, value: true }));
      const commentPage = await fetchFunc(request);

      const pagination: Pagination = {
        size: commentPage.size,
        page: commentPage.page,
        isLast: commentPage.isLast,
      };

      dispatch(setIsGettingNextPage({ id, value: false }));
      dispatch(setPagination({ id, value: pagination }));
      dispatch(appendChildren({ parentId: id, children: commentPage.content }));
    } catch (error: unknown) {
      dispatch(setIsGettingNextPage({ id, value: false }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const getPriorityComments =
  (parentId: number, priorityIds?: number[]): AppThunk =>
  async (dispatch, getState) => {
    if (!priorityIds) {
      return;
    }
    dispatch(setIsLoading({ id: parentId, value: true }));
    for (const priorityId of priorityIds) {
      await dispatch(appendSingleComment(priorityId, parentId));
    }
    dispatch(setIsLoading({ id: parentId, value: false }));
  };

export const getParentComments = (request: FetchPostCommentRequest): AppThunk => {
  return getCommentPageDispatcher(request, getPostComments, 0);
};

export const appendParentComments = (request: FetchPostCommentRequest): AppThunk => {
  return appendCommentPageDispatcher(request, getPostComments, 0);
};

export const deleteAppComment =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(deleteCommentState({ id: id }));
      await deleteComment(id);
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const getChildrenComment = (request: FetchChildrenCommentRequest): AppThunk => {
  return getCommentPageDispatcher(request, getPostChildrenComments, request.parentId);
};

export const reply =
  (commentUploadData: CommentUploadFormData, replyToId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const newComment = await getNewComment(commentUploadData);
      const id = await uploadReply(newComment, replyToId);
      const comment = await getComment(id);
      dispatch(addReply({ replyToId, reply: comment }));
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const uploadComment =
  (commentUploadData: CommentUploadFormData, postId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const newComment = await getNewComment(commentUploadData);
      const id = await uploadNewPostComment(newComment, postId);
      const comment = await getComment(id);

      dispatch(addReply({ reply: comment, replyToId: 0 }));
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const upvoteComment =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setUpvotes({ id, value: 1 }));
      await upvote(id);
    } catch (error: unknown) {
      dispatch(setUpvotes({ id, value: -1 }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const unUpvoteComment =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setUpvotes({ id, value: -1 }));
      await unUpvote(id);
    } catch (error: unknown) {
      dispatch(setUpvotes({ id, value: 1 }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const update =
  (id: number, commentUploadData: CommentUploadFormData): AppThunk =>
  async (dispatch, getState) => {
    try {
      const currentComment = getState().comment[id].comment!;
      const isTextChanged = currentComment.text !== commentUploadData.text;
      const isMediaChanged = currentComment.mediaUrl !== commentUploadData.file?.url;

      if (isTextChanged || isMediaChanged) {
        const newComment = await getNewComment(commentUploadData);
        updateComment(id, newComment);
        dispatch(
          updateCommentState({
            id,
            newComment,
          }),
        );
      }
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const downvoteComment =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setDownvotes({ id, value: 1 }));
      await downvote(id);
    } catch (error: unknown) {
      dispatch(setDownvotes({ id, value: -1 }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const unDownvoteComment =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setDownvotes({ id, value: -1 }));
      await unDownvote(id);
    } catch (error: unknown) {
      dispatch(setDownvotes({ id, value: 1 }));
      handleError(dispatch, error, setErrorMessage);
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
  (id: number, parentId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const comment = await getComment(id);
      dispatch(appendChildren({ parentId, children: [comment] }));
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const follow =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setCommentFollowed({ id, value: true }));
      message.success(
        'Comment followed! You will receive notification when this comment receives replies.',
      );
      await followComment(id);
    } catch (error: unknown) {
      dispatch(setCommentFollowed({ id, value: false }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const unFollow =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setCommentFollowed({ id, value: false }));
      message.success("You won't receive notification from this comment!");
      await unFollowComment(id);
    } catch (error: unknown) {
      dispatch(setCommentFollowed({ id, value: true }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const turnOnNotification =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setSendNotification({ id, value: true }));
      message.success('You will now receive notifications from this comment!');
      await turnOnCommentNotifications(id);
    } catch (error: unknown) {
      dispatch(setSendNotification({ id, value: false }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const turnOffNotification =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setSendNotification({ id, value: false }));
      message.success('You will now receive notifications from this comment!');
      await turnOffCommentNotification(id);
    } catch (error: unknown) {
      dispatch(setSendNotification({ id, value: true }));
      handleError(dispatch, error, setErrorMessage);
    }
  };
