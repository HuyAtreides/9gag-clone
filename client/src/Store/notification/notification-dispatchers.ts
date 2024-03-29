import { AppThunk } from '..';
import { Constant } from '../../models/enums/constant';
import { WebSocketEvent } from '../../models/enums/web-socket-event';
import PageOptions from '../../models/page-options';
import {
  countNotViewedNotifications,
  getAllNotifications,
  getLatestNotifications,
  markNotificationsAsViewed,
  markSpecificNotificationAsViewed,
  removeAllNotifications,
} from '../../services/notification-service';
import { handleError } from '../../utils/error-handler';
import { WebSocketUtils } from '../../utils/web-socket-utils';
import {
  appendLatestNotifications,
  appendNewNotifications,
  markAllNotificationsAsViewed,
  markNotificationAsViewed,
  setIsGettingPage,
  setIsLoading,
  setNotificationErrorMessage,
  setNotifications,
  setNotViewedCount,
  setPagination,
} from './notification-slice';

export const getNotifications =
  (pageOptions: PageOptions): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const page = await getAllNotifications(pageOptions);
      dispatch(setIsLoading(false));
      dispatch(setNotifications(page.content));
      dispatch(
        setPagination({
          isLast: page.isLast,
          size: page.size,
          page: page.page,
        }),
      );
    } catch (error: unknown) {
      dispatch(setIsLoading(false));
      handleError(dispatch, error, setNotificationErrorMessage);
    }
  };

export const addNotifications =
  (pageOptions: PageOptions): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingPage(true));
      const page = await getAllNotifications(pageOptions);
      dispatch(setIsGettingPage(false));
      dispatch(appendNewNotifications(page.content));
      dispatch(
        setPagination({
          isLast: page.isLast,
          size: page.size,
          page: page.page,
        }),
      );
    } catch (error: unknown) {
      dispatch(setIsGettingPage(false));
      handleError(dispatch, error, setNotificationErrorMessage);
    }
  };

export const markAllAsViewed = (): AppThunk => async (dispatch, getState) => {
  try {
    markNotificationsAsViewed();
    dispatch(markAllNotificationsAsViewed());
  } catch (error: unknown) {
    handleError(dispatch, error, setNotificationErrorMessage);
  }
};

export const removeNotifications = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setIsLoading(true));
    await removeAllNotifications();
    dispatch(setIsLoading(false));
    dispatch(setNotifications([]));
    dispatch(setPagination(null));
  } catch (error: unknown) {
    dispatch(setIsLoading(false));
    handleError(
      dispatch,
      "Can't clear all notifications. Please try again latter",
      setNotificationErrorMessage,
    );
  }
};

export const markAsViewed =
  (notificationId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const index = getState().notification.notifications!.findIndex(
        (notification) => notification.id === notificationId,
      );
      const notViewedCount = getState().notification.notViewedCount;
      dispatch(markNotificationAsViewed(index));
      dispatch(setNotViewedCount(Math.max(notViewedCount - 1, 0)));
      await markSpecificNotificationAsViewed(notificationId);
    } catch (error: unknown) {
      handleError(
        dispatch,
        "Can't mark notification as viewed",
        setNotificationErrorMessage,
      );
    }
  };

export const addLatestNotifications = (): AppThunk => async (dispatch, getState) => {
  try {
    const notifications = getState().notification.notifications;
    const notViewedCount = getState().notification.notViewedCount;
    const user = getState().user.profile;

    if (!user) {
      return;
    }

    const currentLatestNotification = notifications ? notifications[0] : null;
    const latestNotifications = await getLatestNotifications(
      currentLatestNotification?.id || 0,
    );
    const notViewedNotifications = latestNotifications.filter(
      (notification) => !notification.isViewed,
    );
    dispatch(appendLatestNotifications(latestNotifications));

    if (notViewedNotifications.length > 0) {
      dispatch(setNotViewedCount(notViewedNotifications.length + notViewedCount));
    }
  } catch (error: unknown) {
    console.log(error);
  }
};

export const countNotViewed = (): AppThunk => async (dispatch, getState) => {
  try {
    const count = await countNotViewedNotifications();
    dispatch(setNotViewedCount(count));
  } catch (error: unknown) {
    console.log(error);
  }
};

export const initialize = (): AppThunk => async (dispatch, getState) => {
  try {
    const pageOptions: PageOptions = {
      size: Constant.PageSize as number,
      page: 0,
    };
    WebSocketUtils.registerEventHandler(WebSocketEvent.RECEIVE_NEW_NOTIFICATION, () => {
      dispatch(addLatestNotifications());
    });
    await dispatch(getNotifications(pageOptions));
  } catch (error: unknown) {
    console.log(error);
  }
};
