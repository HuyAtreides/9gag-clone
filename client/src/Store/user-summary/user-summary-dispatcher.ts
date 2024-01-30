import { message } from 'antd';
import { AppThunk } from '..';
import { Pagination } from '../../models/page';
import { FetchUserRequest } from '../../models/requests/fetch-user-request';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import { User } from '../../models/user';
import {
  cancelFollowRequest,
  sendFollowRequest,
} from '../../services/follow-request-service';
import {
  addUserToRecentSearch,
  blockUser,
  followUser,
  getRecentSearchUser,
  getRestrictingUser,
  getUserBlocking,
  getUserFollowers,
  getUserFollowing,
  removeUserFollower,
  removeUserFromRecentSearch,
  searchUser,
  unFollowUser,
  unRestrictUser,
  unblockUser,
} from '../../services/user-service';
import { handleError } from '../../utils/error-handler';
import { PageFetchingFunction } from '../../utils/types/page-fetching-function';
import { setConversationBlocked, setConversationRestricted } from '../chat/chat-slice';
import {
  appendNewUsers,
  removeUser,
  setIsGettingPage,
  setIsLoading,
  setPagination,
  setUserSummaryBlocked,
  setUserSummaryErrorMessage,
  setUserSummaryFollowed,
  setUserSummaryReceivedFollowRequest,
  setUserSummaryRestricted,
  setUsers,
} from './user-summary-slice';

export const getSummaryUserList =
  <T extends PageFetchingRequest>(
    request: T,
    fetchFunc: PageFetchingFunction<T, User>,
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
      dispatch(setIsLoading(false));
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const appendUserSummary =
  <T extends PageFetchingRequest>(
    request: T,
    fetchFunc: PageFetchingFunction<T, User>,
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
      dispatch(setIsGettingPage(false));
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const getFollowers = (request: FetchUserRequest) => {
  return getSummaryUserList(request, getUserFollowers);
};

export const addToRecentSearch =
  (userId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      await addUserToRecentSearch(userId);
    } catch (err: unknown) {
      console.log(err);
    }
  };

export const removeRecentSearch =
  (userId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(removeUser(userId));
      await removeUserFromRecentSearch(userId);
    } catch (err: unknown) {
      console.log(err);
    }
  };

export const search = (request: PageFetchingRequest) => {
  return getSummaryUserList(request, searchUser);
};

export const appendSearchResult = (request: PageFetchingRequest) => {
  return appendUserSummary(request, searchUser);
};

export const getBlocking = (request: PageFetchingRequest) => {
  return getSummaryUserList(request, getUserBlocking);
};

export const appendBlocking = (request: PageFetchingRequest) => {
  return appendUserSummary(request, getUserBlocking);
};

export const getRestricting = (request: PageFetchingRequest) => {
  return getSummaryUserList(request, getRestrictingUser);
};

export const appendRestricting = (request: PageFetchingRequest) => {
  return appendUserSummary(request, getRestrictingUser);
};

export const getRecentSearch = (request: PageFetchingRequest) => {
  return getSummaryUserList(request, getRecentSearchUser);
};

export const appendRecentSearch = (request: PageFetchingRequest) => {
  return appendUserSummary(request, getRecentSearchUser);
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

export const sendRequest =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setUserSummaryReceivedFollowRequest({ id, value: true }));
      message.success('Follow request sent!');
      await sendFollowRequest(id);
    } catch (error: unknown) {
      dispatch(setUserSummaryReceivedFollowRequest({ id, value: false }));
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const cancelRequest =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setUserSummaryReceivedFollowRequest({ id, value: false }));
      message.info('Follow request canceled');
      await cancelFollowRequest(id);
    } catch (error: unknown) {
      dispatch(setUserSummaryReceivedFollowRequest({ id, value: true }));
      handleError(dispatch, error, setUserSummaryErrorMessage);
    }
  };

export const blockInSummaryList =
  (userId: number): AppThunk =>
  async (dispatch, _) => {
    try {
      await blockUser(userId);
      dispatch(setUserSummaryBlocked({ id: userId, value: true }));
      dispatch(setConversationBlocked({ userId, value: true }));
    } catch (err: unknown) {
      handleError(dispatch, err, setUserSummaryErrorMessage);
    }
  };

export const unblock =
  (userId: number): AppThunk =>
  async (dispatch, _) => {
    try {
      await unblockUser(userId);
      dispatch(setUserSummaryBlocked({ id: userId, value: false }));
      dispatch(setConversationBlocked({ userId, value: false }));
    } catch (err: unknown) {
      handleError(dispatch, err, setUserSummaryErrorMessage);
    }
  };

export const restrictInSummaryList =
  (userId: number): AppThunk =>
  async (dispatch, _) => {
    try {
      await unRestrictUser(userId);
      dispatch(setUserSummaryRestricted({ id: userId, value: true }));
      dispatch(setConversationRestricted({ userId, value: true }));
    } catch (err: unknown) {
      handleError(dispatch, err, setUserSummaryErrorMessage);
    }
  };

export const unRestrictInSummaryList =
  (userId: number): AppThunk =>
  async (dispatch, _) => {
    try {
      await unRestrictUser(userId);
      dispatch(setUserSummaryRestricted({ id: userId, value: false }));
      dispatch(setConversationRestricted({ userId, value: false }));
    } catch (err: unknown) {
      handleError(dispatch, err, setUserSummaryErrorMessage);
    }
  };
