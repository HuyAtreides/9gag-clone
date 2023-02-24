import { BellFilled } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import React, { useEffect, useRef } from 'react';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  countNotViewed,
  initialize,
} from '../../../../Store/notification/notification-dispatchers';
import { clearNotViewedCount } from '../../../../Store/notification/notification-slice';
import styles from '../../Navbar.module.scss';
import Notifications from '../Notifications';

const promiseWithUndefinedValue = Promise.resolve(undefined);
export const IntervalIdContext = React.createContext<Promise<undefined | NodeJS.Timer>>(
  promiseWithUndefinedValue,
);

const NotificationContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  const notViewedCount = useAppSelector((state) => state.notification.notViewedCount);
  const intervalRef = useRef<Promise<undefined | NodeJS.Timer>>(
    promiseWithUndefinedValue,
  );

  const clearNotViewedNotificationsCount = () => {
    dispatch(clearNotViewedCount());
  };

  useEffect(() => {
    dispatch(countNotViewed());

    if (user) {
      intervalRef.current = (async () => {
        const intervalId = await dispatch(initialize());
        return intervalId as unknown as undefined | NodeJS.Timer;
      })();
    }
  }, [dispatch, user]);

  return (
    <AuthenticatedGuard
      component={
        <Popover
          placement='bottom'
          trigger='click'
          content={
            <IntervalIdContext.Provider value={intervalRef.current}>
              <Notifications />
            </IntervalIdContext.Provider>
          }
        >
          <Badge count={notViewedCount}>
            <Button
              shape='circle'
              icon={<BellFilled />}
              className={styles.iconCollapse}
              onClick={clearNotViewedNotificationsCount}
            />
          </Badge>
        </Popover>
      }
    />
  );
};

export default NotificationContainer;
