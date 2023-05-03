import { message } from 'antd';
import { AppThunk } from '..';
import { FollowRequestStatus } from '../../models/enums/follow-request-status';
import { FollowRequestFetchingRequest } from '../../models/requests/follow-request-fetching-request';
import {
  acceptFollowRequest,
  declineFollowRequest,
  deleteFollowRequest,
  getFollowRequest,
} from '../../services/follow-request-service';
import { handleError } from '../../utils/error-handler';
import {
  appendRequests,
  removeRequest,
  setErrorMessage,
  setIsGettingNextRequests,
  setIsLoading,
  setIsProcessing,
  setPagination,
  setRequestStatus,
} from './follow-request-slice';
import { getFollowRequests } from '../../services/follow-request-service';

export const accept =
  (id: number): AppThunk =>
  async (dispatch, _) => {
    try {
      dispatch(setIsProcessing({ id, value: true }));
      await acceptFollowRequest(id);
      dispatch(setIsProcessing({ id, value: false }));
      dispatch(setRequestStatus({ id, value: FollowRequestStatus.ACCEPTED }));
      message.info('Follow request accepted!');
    } catch (error: unknown) {
      dispatch(setIsProcessing({ id, value: false }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const deleteRequest =
  (id: number): AppThunk =>
  async (dispatch, _) => {
    try {
      dispatch(setIsProcessing({ id, value: true }));
      await deleteFollowRequest(id);
      dispatch(setIsProcessing({ id, value: false }));
      dispatch(removeRequest(id));
      message.info('Follow request deleted');
    } catch (error: unknown) {
      dispatch(setIsProcessing({ id, value: false }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const decline =
  (id: number): AppThunk =>
  async (dispatch, _) => {
    try {
      dispatch(setIsProcessing({ id, value: true }));
      await declineFollowRequest(id);
      dispatch(setIsProcessing({ id, value: false }));
      dispatch(setRequestStatus({ id, value: FollowRequestStatus.DECLINED }));
      message.info('Follow request declined!');
    } catch (error: unknown) {
      dispatch(setIsProcessing({ id, value: false }));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const getRequestPage =
  (pageFetchingRequest: FollowRequestFetchingRequest): AppThunk =>
  async (dispatch, _) => {
    try {
      dispatch(setIsLoading(true));
      await dispatch(getPriorityFollowRequest(pageFetchingRequest.priorityIds));

      const page = await getFollowRequests(pageFetchingRequest);
      dispatch(setPagination(page));
      dispatch(appendRequests(page.content));
      dispatch(setIsLoading(false));
    } catch (error: unknown) {
      dispatch(setIsLoading(false));
      handleError(dispatch, error, setErrorMessage);
    }
  };

const getSpecificRequest =
  (id: number): AppThunk =>
  async (dispatch, _) => {
    try {
      const request = await getFollowRequest(id);
      dispatch(appendRequests([request]));
    } catch (error: unknown) {
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const appendRequestPage =
  (pageFetchingRequest: FollowRequestFetchingRequest): AppThunk =>
  async (dispatch, _) => {
    try {
      dispatch(setIsGettingNextRequests(true));
      const page = await getFollowRequests(pageFetchingRequest);
      dispatch(setPagination(page));
      dispatch(appendRequests([...page.content]));
      dispatch(setIsGettingNextRequests(false));
    } catch (error: unknown) {
      dispatch(setIsGettingNextRequests(false));
      handleError(dispatch, error, setErrorMessage);
    }
  };

export const getPriorityFollowRequest =
  (priorityIds?: number[]): AppThunk =>
  async (dispatch, _) => {
    if (!priorityIds) {
      return;
    }

    dispatch(setIsLoading(true));
    for (const id of priorityIds) {
      await dispatch(getSpecificRequest(id));
    }
  };
