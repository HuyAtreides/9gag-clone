import { AppThunk } from '..';
import { Pagination } from '../../models/page';
import { FetchUserCommentRequest } from '../../models/requests/fetch-user-comment-request';
import { getUserComments } from '../../services/comment-service';
import { handleError } from '../../utils/error-handler';
import {
  appendComments,
  setErrorMessage,
  setIsGettingComments,
  setIsGettingNextComments,
  setPagination,
} from './abbreviate-comment-slice';

export const getCommentsOfUser =
  (request: FetchUserCommentRequest): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingComments(true));
      const commentPage = await getUserComments(request);
      const pagination: Pagination = {
        size: commentPage.size,
        page: commentPage.page,
        isLast: commentPage.isLast,
      };
      dispatch(setIsGettingComments(false));
      dispatch(setPagination(pagination));
      dispatch(appendComments(commentPage.content));
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const getNextCommentsOfUser =
  (request: FetchUserCommentRequest): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingNextComments(true));
      const commentPage = await getUserComments(request);
      const pagination: Pagination = {
        size: commentPage.size,
        page: commentPage.page,
        isLast: commentPage.isLast,
      };
      dispatch(setIsGettingNextComments(false));
      dispatch(setPagination(pagination));
      dispatch(appendComments(commentPage.content));
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };
