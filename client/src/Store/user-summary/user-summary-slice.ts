import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Pagination } from '../../models/page';
import { User } from '../../models/user';

interface UserSummaryState {
  readonly isLoading: boolean;
  readonly isGettingPage: boolean;
  readonly users: User[];
  readonly pagination: Pagination | null;
  readonly errorMessage: string | null;
}

const initialState: UserSummaryState = {
  isGettingPage: false,
  isLoading: false,
  users: [],
  pagination: null,
  errorMessage: null,
};

const userSummarySlice = createSlice({
  name: 'userSummary',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setIsGettingPage(state, action: PayloadAction<boolean>) {
      state.isGettingPage = action.payload;
    },

    setUserSummaryErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },

    setPagination(state, action: PayloadAction<Pagination | null>) {
      state.pagination = action.payload;
    },

    setUsers(state, action: PayloadAction<readonly User[]>) {
      state.users = action.payload.map((user) => user);
    },

    appendNewUsers(state, action: PayloadAction<readonly User[]>) {
      state.users?.push(...action.payload);
    },

    resetState(state) {
      return initialState;
    },

    setUserSummaryFollowed(state, action: PayloadAction<{ id: number; value: boolean }>) {
      const { id, value } = action.payload;
      const index = state.users.findIndex((user) => user.id === id);
      const currentUser = state.users[index];
      state.users[index] = new User({
        ...currentUser,
        followed: value,
      });
    },

    removeUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const {
  setIsLoading,
  setIsGettingPage,
  setUserSummaryErrorMessage,
  setUsers,
  setPagination,
  appendNewUsers,
  setUserSummaryFollowed,
  removeUser,
  resetState,
} = userSummarySlice.actions;
export const userSummaryReducers = userSummarySlice.reducer;
