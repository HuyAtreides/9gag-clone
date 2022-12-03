import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Notification from '../../models/notification';
import { Pagination } from '../../models/page';

interface NotificationState {
  readonly isLoading: boolean;
  readonly isGettingPage: boolean;
  readonly notifications: Notification[] | null;
  readonly pagination: Pagination | null;
  readonly notViewedCount: number;
  readonly errorMessage: string | null;
}

const initialState: NotificationState = {
  isGettingPage: false,
  isLoading: true,
  notViewedCount: 0,
  notifications: null,
  pagination: null,
  errorMessage: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setIsGettingPage(state, action: PayloadAction<boolean>) {
      state.isGettingPage = action.payload;
    },

    setNotificationErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },

    setPagination(state, action: PayloadAction<Pagination | null>) {
      state.pagination = action.payload;
    },

    setNotifications(state, action: PayloadAction<readonly Notification[] | null>) {
      state.notifications = action.payload ? action.payload.map((value) => value) : null;
    },

    appendNewNotifications(state, action: PayloadAction<readonly Notification[]>) {
      state.notifications?.push(...action.payload);
    },

    appendLatestNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications?.unshift(...action.payload);
    },

    markAllNotificationsAsViewed(state, action: PayloadAction<void>) {
      state.notifications?.forEach((notification) => {
        notification.isViewed = true;
      });
    },

    markNotificationAsViewed(state, action: PayloadAction<number>) {
      const index = action.payload;
      state.notifications![index].isViewed = true;
    },

    clearNotViewedCount(state, _: PayloadAction<void>) {
      state.notViewedCount = 0;
    },

    resetNotificationState(state, _: PayloadAction<void>) {
      state = initialState;
    },

    setNotViewedCount(state, action: PayloadAction<number>) {
      state.notViewedCount = action.payload;
    },
  },
});

export const {
  setIsGettingPage,
  setNotificationErrorMessage,
  setPagination,
  setIsLoading,
  setNotifications,
  appendNewNotifications,
  markAllNotificationsAsViewed,
  markNotificationAsViewed,
  clearNotViewedCount,
  resetNotificationState,
  setNotViewedCount,
  appendLatestNotifications,
} = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
