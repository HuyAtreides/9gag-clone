import { BellFilled } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
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

const NotificationContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  const notViewedCount = useAppSelector((state) => state.notification.notViewedCount);
  const [showNotifications, setShowNotifications] = useState(false);

  const clearNotViewedNotificationsCount = () => {
    dispatch(clearNotViewedCount());
  };

  useEffect(() => {
    if (user) {
      dispatch(countNotViewed());
    }

    dispatch(initialize());
  }, [dispatch, user]);

  return (
    <AuthenticatedGuard
      component={
        <Popover
          placement='bottom'
          getPopupContainer={(container) => container.parentElement!}
          trigger='click'
          visible={showNotifications}
          onVisibleChange={setShowNotifications}
          content={<Notifications setShowNotifications={setShowNotifications} />}
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
