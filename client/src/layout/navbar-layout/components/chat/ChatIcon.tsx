import { CommentOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import styles from './ChatIcon.module.css';
import EmbeddedConversationPreview from './EmbeddedConversationsPreview';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import { useEffect, useState } from 'react';
import { WebSocketUtils } from '../../../../utils/web-socket-utils';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { WebSocketEvent } from '../../../../models/enums/web-socket-event';
import {
  countUnreadConversation,
  getLatestConversationsState,
  resetUnreadCount,
  updateOpenConversation,
} from '../../../../Store/chat/chat-dispatchers';

const ChatIcon = () => {
  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);
  const unreadCount = useAppSelector((state) => state.chat.unreadConversationsCount);

  useEffect(() => {
    WebSocketUtils.registerEventHandler(WebSocketEvent.RECEIVE_NEW_MESSAGE, () => {
      dispatch(getLatestConversationsState());
    });
    WebSocketUtils.registerEventHandler(WebSocketEvent.MARK_AS_READ, () => {
      dispatch(updateOpenConversation());
    });
    dispatch(countUnreadConversation());
  }, [dispatch]);

  const handleClick = () => {
    setVisible(true);
    dispatch(resetUnreadCount());
  };

  return (
    <AuthenticatedGuard
      component={
        <Popover
          visible={visible}
          content={<EmbeddedConversationPreview closePreview={() => setVisible(false)} />}
          placement='bottom'
          trigger='click'
          destroyTooltipOnHide={false}
          onVisibleChange={(value) => setVisible(value)}
          getPopupContainer={(container) => container.parentElement!}
        >
          <Badge count={unreadCount}>
            <Button
              onClick={handleClick}
              shape='circle'
              icon={<CommentOutlined />}
              className={styles.chatIcon}
            />
          </Badge>
        </Popover>
      }
    />
  );
};

export default ChatIcon;
