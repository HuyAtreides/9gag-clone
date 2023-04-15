import { AppThunk } from '..';
import { FetchUserCommentRequest } from '../../models/requests/fetch-user-comment-request';
import { User } from '../../models/user';
import { PageFetchingFunction } from '../../utils/types/page-fetching-function';
import { FetchUserRequest } from '../../models/requests/fetch-user-request';
import {
  appendNewUsers,
  removeUser,
  setIsGettingPage,
  setIsLoading,
  setPagination,
  setUserSummaryErrorMessage,
  setUserSummaryFollowed,
  setUsers,
} from './user-summary-slice';
import { Pagination } from '../../models/page';
import { handleError } from '../../utils/error-handler';
import {
  followUser,
  getUserFollowers,
  getUserFollowing,
  removeUserFollower,
  unFollowUser,
} from '../../services/user-service';
import { message } from 'antd';

export const getSummaryUserList =
  (
    request: FetchUserRequest,
    fetchFunc: PageFetchingFunction<FetchUserCommentRequest, User>,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const pageOfUsers = await fetchFunc(request);

      const pagination: Pagination = {
        size: pageOfUsers.size,
        page: pageOfUsers.page,
        isLast: pageOfUsers.isLast,
      };

      dispatch(setIsLoading(false));
      dispatch(setPagination(pagination));
      dispatch(setUsers(pageOfUsers.content));
    } catch (error: unknown) {
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const appendUserSummary =
  (
    request: FetchUserRequest,
    fetchFunc: PageFetchingFunction<FetchUserCommentRequest, User>,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingPage(true));
      const pageOfUsers = await fetchFunc(request);

      const pagination: Pagination = {
        size: pageOfUsers.size,
        page: pageOfUsers.page,
        isLast: pageOfUsers.isLast,
      };

      dispatch(setIsGettingPage(false));
      dispatch(setPagination(pagination));
      dispatch(appendNewUsers(pageOfUsers.content));
    } catch (error: unknown) {
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const getFollowers = (request: FetchUserRequest) => {
  return getSummaryUserList(request, getUserFollowers);
};

export const appendFollowers = (request: FetchUserRequest) => {
  return appendUserSummary(request, getUserFollowers);
};

export const getFollowing = (request: FetchUserRequest) => {
  return getSummaryUserList(request, getUserFollowing);
};

export const appendFollowing = (request: FetchUserRequest) => {
  return appendUserSummary(request, getUserFollowing);
};

export const followUserInSummaryList =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      message.success('User followed!');
      dispatch(setUserSummaryFollowed({ id, value: true }));
      await followUser(id);
    } catch (error: unknown) {
      dispatch(setUserSummaryFollowed({ id, value: false }));
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const unFollowUserInSummaryList =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      message.success('User un-followed!');
      dispatch(setUserSummaryFollowed({ id, value: false }));
      await unFollowUser(id);
    } catch (error: unknown) {
      dispatch(setUserSummaryFollowed({ id, value: true }));
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const removeFollower =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      message.success('Follower removed');
      dispatch(removeUser(id));
      await removeUserFollower(id);
    } catch (error: unknown) {
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };
