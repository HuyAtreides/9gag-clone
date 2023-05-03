import { BellFilled } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  countNotViewed,
  initialize,
} from '../../../../Store/notification/notification-dispatchers';
import { clearNotViewedCount } from '../../../../Store/notification/notification-slice';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import { abbreviateNumber } from '../../../../utils/abbreviate-number';
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
  const [showNotifications, setShowNotifications] = useState(false);

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
          visible={showNotifications}
          onVisibleChange={setShowNotifications}
          content={
            <IntervalIdContext.Provider value={intervalRef.current}>
              <Notifications setShowNotifications={setShowNotifications} />
            </IntervalIdContext.Provider>
          }
        >
          <Badge count={abbreviateNumber(notViewedCount)}>
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
