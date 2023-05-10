import {
  CheckSquareOutlined,
  CommentOutlined,
  LikeOutlined,
  MoreOutlined,
  PlusSquareOutlined,
  SendOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, List, Typography } from 'antd';
import React, { ReactElement, useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Store';
import {
  addNotifications,
  markAllAsViewed,
  markAsViewed,
  removeNotifications,
} from '../../../Store/notification/notification-dispatchers';
import {
  resetNotificationState,
  setNotificationErrorMessage,
} from '../../../Store/notification/notification-slice';
import CenterSpinner from '../../../components/center-spinner/CenterSpinner';
import useRemoveErrorWhenUnmount from '../../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../../custom-hooks/render-error-message';
import { Constant } from '../../../models/enums/constant';
import { NotificationType } from '../../../models/enums/notification-type';
import Notification from '../../../models/notification';
import PageOptions from '../../../models/page-options';
import { IntervalIdContext } from './notifications-container/NotificationContainer';

import AutoClosePopover from '../../../components/auto-close-popover/AutoClosePopover';
import styles from './Notifications.module.scss';

const NOTIFICATION_TYPE_TO_ICON_MAP: Record<NotificationType, ReactElement> = {
  [NotificationType.ADD_COMMENT]: <CommentOutlined />,
  [NotificationType.ADD_REPLY]: <CommentOutlined />,
  [NotificationType.VOTE_COMMENT]: <LikeOutlined />,
  [NotificationType.VOTE_POST]: <LikeOutlined />,
  [NotificationType.FOLLOWING_POST_HAS_NEW_COMMENT]: <CommentOutlined />,
  [NotificationType.ADD_POST]: <PlusSquareOutlined />,
  [NotificationType.FOLLOW_USER]: <UserAddOutlined />,
  [NotificationType.SEND_FOLLOW_REQUEST]: <SendOutlined />,
  [NotificationType.FOLLOW_REQUEST_ACCEPTED]: <CheckSquareOutlined />,
};

interface Props {
  setShowNotifications: (showNotifications: boolean) => void;
}

const Notifications: React.FC<Props> = ({ setShowNotifications }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);
  const page = useAppSelector((state) => state.notification.pagination?.page);
  const pagination = useAppSelector((state) => state.notification.pagination);
  const isLast = !pagination || pagination.isLast;
  const isLoading = useAppSelector((state) => state.notification.isLoading);
  const errorMessage = useAppSelector((state) => state.notification.errorMessage);
  const isGettingPage = useAppSelector((state) => state.notification.isGettingPage);
  const context = useContext(IntervalIdContext);
  useRemoveErrorWhenUnmount(setNotificationErrorMessage);
  useRenderErrorMessage(errorMessage, setNotificationErrorMessage);

  useEffect(() => {
    return () => {
      dispatch(resetNotificationState());
      (async function () {
        clearInterval(await context);
      })();
    };
  }, [context, dispatch]);

  const getNextPage = () => {
    if (isGettingPage) {
      return;
    }

    const nextPageOptions: PageOptions = {
      page: page! + 1,
      size: Constant.PageSize as number,
    };

    dispatch(addNotifications(nextPageOptions));
  };

  const clearNotifications = () => {
    if (isLoading) {
      return;
    }

    dispatch(removeNotifications());
  };

  const viewNotification = (notification: Notification, index: number) => {
    setShowNotifications(false);
    window.scrollTo(0, 0);
    if (notification.isViewed) {
      return;
    }
    dispatch(markAsViewed(index));
  };

  const viewAllNotification = () => {
    dispatch(markAllAsViewed());
  };

  if (isLoading) {
    return (
      <div className={styles.notifyContainer}>
        <div className={styles.notificationHeader}>
          <Typography.Title level={3}>Notifications</Typography.Title>
        </div>
        <CenterSpinner />
      </div>
    );
  }

  return (
    <div className={styles.notifyContainer}>
      <div className={styles.notificationHeader}>
        <Typography.Title level={3}>Notifications</Typography.Title>
        <AutoClosePopover
          content={
            <>
              <Button type='text' block onClick={clearNotifications}>
                Clear
              </Button>
              <Button type='text' block onClick={viewAllNotification}>
                Read All
              </Button>
            </>
          }
        >
          <Button type='text' icon={<MoreOutlined />} />
        </AutoClosePopover>
      </div>
      <InfiniteScroll
        dataLength={notifications!.length}
        hasMore={!isLast}
        next={getNextPage}
        loader={<CenterSpinner />}
        height={window.innerHeight * 0.4}
      >
        <List
          className={styles.notifications}
          dataSource={notifications!}
          renderItem={(item, index) => {
            return (
              <List.Item
                className={`${styles.notification} ${
                  item.isViewed ? null : styles.notViewedNotification
                }`}
                key={item.id}
              >
                <Link to={item.destUrl} onClick={() => viewNotification(item, index)}>
                  <div className={styles.notificationDescriptionContainer}>
                    {NOTIFICATION_TYPE_TO_ICON_MAP[item.type]}
                    <Typography.Paragraph className={styles.notificationDescription}>
                      {item.message}
                    </Typography.Paragraph>
                  </div>
                  <Typography.Paragraph
                    className={styles.notificationDate}
                    strong={true}
                    type='secondary'
                  >
                    {item.created.toDateString()} {item.created.toLocaleTimeString()}
                  </Typography.Paragraph>
                </Link>
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Notifications;
