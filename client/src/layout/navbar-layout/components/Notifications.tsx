import { MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Typography } from 'antd';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Store';
import {
  addNotifications,
  markAllAsViewed,
  markAsViewed,
  removeNotifications,
} from '../../../Store/notification/notification-dispatchers';
import { setNotificationErrorMessage } from '../../../Store/notification/notification-slice';
import AutoClosePopover from '../../../components/auto-close-popover/AutoClosePopover';
import CenterSpinner from '../../../components/center-spinner/CenterSpinner';
import useRemoveErrorWhenUnmount from '../../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../../custom-hooks/render-error-message';
import useTimeDiffFromToday from '../../../custom-hooks/use-time-diff-from-today';
import { Constant } from '../../../models/enums/constant';
import { NotificationType } from '../../../models/enums/notification-type';
import Notification from '../../../models/notification';
import PageOptions from '../../../models/page-options';
import styles from './Notifications.module.scss';

const NOTIFICATION_TYPE_TO_MESSAGE_MAP: Record<NotificationType, string> = {
  [NotificationType.ADD_COMMENT]: 'commented to your post',
  [NotificationType.ADD_REPLY]: 'replied to your comment',
  [NotificationType.VOTE_COMMENT]: 'voted your comment',
  [NotificationType.VOTE_POST]: 'voted your post',
  [NotificationType.FOLLOWING_POST_HAS_NEW_COMMENT]:
    'commented to a post that you are following',
  [NotificationType.ADD_POST]: 'added a new post',
  [NotificationType.FOLLOW_USER]: 'followed you',
  [NotificationType.SEND_FOLLOW_REQUEST]: 'sent you a follow request',
  [NotificationType.FOLLOW_REQUEST_ACCEPTED]: 'accepted you follow request',
  [NotificationType.SHARE_POST]: 'shared your post',
};

interface Props {
  readonly setShowNotifications: (showNotifications: boolean) => void;
}

interface NotificationItemProps extends Props {
  readonly notification: Notification;
}

const NotificationItem = ({
  notification,
  setShowNotifications,
}: NotificationItemProps) => {
  const dispatch = useAppDispatch();
  const timeDiff = useTimeDiffFromToday(notification.created);

  const viewNotification = () => {
    setShowNotifications(false);
    window.scrollTo(0, 0);
    if (notification.isViewed) {
      return;
    }
    dispatch(markAsViewed(notification.id));
  };

  return (
    <List.Item key={notification.id}>
      <Link
        to={notification.destUrl}
        className={styles.notificationLink}
        onClick={viewNotification}
      >
        <List.Item.Meta
          className={notification.isViewed ? undefined : styles.notViewedNotification}
          avatar={<Avatar src={notification.sender.avatarUrl} size={50} />}
          title={
            <Typography.Text
              className={styles.notificationMessage}
              strong={!notification.isViewed}
              type={notification.isViewed ? 'secondary' : undefined}
            >
              {notification.sender.displayName}{' '}
              {NOTIFICATION_TYPE_TO_MESSAGE_MAP[notification.type]}
            </Typography.Text>
          }
          description={
            <Typography.Text
              className={styles.notificationDate}
              strong={!notification.isViewed}
              type={notification.isViewed ? 'secondary' : undefined}
            >
              {timeDiff}
            </Typography.Text>
          }
        />
      </Link>
    </List.Item>
  );
};

const Notifications: React.FC<Props> = ({ setShowNotifications }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);
  const page = useAppSelector((state) => state.notification.pagination?.page);
  const pagination = useAppSelector((state) => state.notification.pagination);
  const isLast = !pagination || pagination.isLast;
  const isLoading = useAppSelector((state) => state.notification.isLoading);
  const errorMessage = useAppSelector((state) => state.notification.errorMessage);
  const isGettingPage = useAppSelector((state) => state.notification.isGettingPage);
  useRemoveErrorWhenUnmount(setNotificationErrorMessage);
  useRenderErrorMessage(errorMessage, setNotificationErrorMessage);

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
          dataSource={notifications!}
          itemLayout='horizontal'
          renderItem={(item, _) => (
            <NotificationItem
              notification={item}
              setShowNotifications={setShowNotifications}
            />
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Notifications;
