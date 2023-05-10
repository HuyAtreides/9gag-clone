import { AppThunk, useAppDispatch } from '../Store';

interface UseToggleNotificationParams {
  readonly turnOnNotificationThunkAction: AppThunk;
  readonly turnOffNotificationThunkAction: AppThunk;
  readonly notificationEnabled: boolean;
}

const useToggleNotification = ({
  turnOffNotificationThunkAction,
  turnOnNotificationThunkAction,
  notificationEnabled,
}: UseToggleNotificationParams) => {
  const dispatch = useAppDispatch();

  return () => {
    if (notificationEnabled) {
      dispatch(turnOffNotificationThunkAction);
      return;
    }

    dispatch(turnOnNotificationThunkAction);
  };
};

export default useToggleNotification;
