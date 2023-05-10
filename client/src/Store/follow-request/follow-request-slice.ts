import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import FollowRequest from '../../models/follow-request';
import { Pagination } from '../../models/page';
import { FollowRequestStatus } from '../../models/enums/follow-request-status';

interface FollowRequestState {
  readonly request: FollowRequest;
  readonly isProcessing: boolean;
}

interface FollowRequestListState {
  readonly isLoading: boolean;
  readonly requestStates: FollowRequestState[];
  readonly isGettingNextRequests: boolean;
  readonly pagination: Pagination | null;
  readonly errorMessage: string | null;
}

const initialState: FollowRequestListState = {
  isLoading: false,
  isGettingNextRequests: false,
  requestStates: [],
  pagination: null,
  errorMessage: null,
};

const followRequestSlice = createSlice({
  name: 'followRequest',
  initialState: initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setIsGettingNextRequests(state, action: PayloadAction<boolean>) {
      state.isGettingNextRequests = action.payload;
    },

    setPagination(state, action: PayloadAction<Pagination>) {
      state.pagination = action.payload;
    },

    setIsProcessing(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const { id, value } = action.payload;
      const index = state.requestStates.findIndex(
        (requestState) => requestState.request.id === id,
      );
      state.requestStates[index].isProcessing = value;
    },

    appendRequests(state, action: PayloadAction<readonly FollowRequest[]>) {
      const requestStates = action.payload
        .filter(
          (request) =>
            !state.requestStates.find((state) => state.request.id === request.id),
        )
        .map((request) => ({
          request,
          isProcessing: false,
        }));
      state.requestStates.push(...requestStates);
    },

    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },

    setRequestStatus(
      state,
      action: PayloadAction<{ id: number; value: FollowRequestStatus }>,
    ) {
      const { id, value } = action.payload;
      const index = state.requestStates.findIndex(
        (requestState) => requestState.request.id === id,
      );
      state.requestStates[index].request.status = value;
    },

    removeRequest(state, action: PayloadAction<number>) {
      const id = action.payload;
      const index = state.requestStates.findIndex(
        (requestState) => requestState.request.id === id,
      );
      state.requestStates.splice(index, 1);
    },

    reset() {
      return initialState;
    },
  },
});

export const followRequestReducer = followRequestSlice.reducer;
export const {
  setIsGettingNextRequests,
  setIsLoading,
  setIsProcessing,
  setPagination,
  setErrorMessage,
  appendRequests,
  setRequestStatus,
  removeRequest,
  reset,
} = followRequestSlice.actions;
