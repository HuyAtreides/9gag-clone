import { CommentOutlined, LikeOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, List, Popover, Typography } from 'antd';
import React, { ReactElement, useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import Loading from '../../../components/loading/Loading';
import useRemoveErrorWhenUnmount from '../../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../../custom-hooks/render-error-message';
import { Constant } from '../../../models/enums/constant';
import { NotificationType } from '../../../models/enums/notification-type';
import Notification from '../../../models/notification';
import PageOptions from '../../../models/page-options';
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
import { IntervalIdContext } from '../NavbarLayout';
import styles from './Notifications.module.scss';

const NOTIFICATION_TYPE_TO_ICON_MAP: Record<NotificationType, ReactElement> = {
  [NotificationType.ADD_COMMENT]: <CommentOutlined />,
  [NotificationType.ADD_REPLY]: <CommentOutlined />,
  [NotificationType.VOTE_COMMENT]: <LikeOutlined />,
  [NotificationType.VOTE_POST]: <LikeOutlined />,
};

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);
  const page = useAppSelector((state) => state.notification.pagination?.page);
  const isLast = useAppSelector((state) => state.notification.pagination?.isLast);
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
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.notifyContainer}>
      <div className={styles.notificationHeader}>
        <Typography.Title level={3}>Notifications</Typography.Title>
        <Popover
          placement='bottom'
          trigger='click'
          color='var(--overlay-background-color)'
          content={
            <>
              <Button
                type='text'
                className={styles.clearButton}
                onClick={clearNotifications}
              >
                Clear
              </Button>
              <Button
                type='text'
                className={styles.clearButton}
                onClick={viewAllNotification}
              >
                Read All
              </Button>
            </>
          }
        >
          <Button type='text' icon={<MoreOutlined />} />
        </Popover>
      </div>
      <InfiniteScroll
        dataLength={notifications!.length}
        hasMore={!isLast}
        next={getNextPage}
        loader={<Loading />}
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
