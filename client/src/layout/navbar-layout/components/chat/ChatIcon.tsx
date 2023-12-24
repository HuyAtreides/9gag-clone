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
  getPossiblyUpdatedMessages,
  resetUnreadCount,
  updateOpenConversation,
} from '../../../../Store/chat/chat-dispatchers';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { setSyncError } from '../../../../Store/chat/chat-slice';
import useRemoveErrorWhenUnmount from '../../../../custom-hooks/remove-error';

const ChatIcon = () => {
  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);
  const syncError = useAppSelector((state) => state.chat.syncError);
  const unreadCount = useAppSelector((state) => state.chat.unreadConversationsCount);

  useRenderErrorMessage(syncError, setSyncError);
  useRemoveErrorWhenUnmount(setSyncError);

  useEffect(() => {
    WebSocketUtils.registerEventHandler(WebSocketEvent.RECEIVE_NEW_MESSAGE, () => {
      dispatch(getLatestConversationsState());
    });
    WebSocketUtils.registerEventHandler(WebSocketEvent.MARK_AS_READ, () => {
      dispatch(updateOpenConversation());
    });
    WebSocketUtils.registerEventHandler(WebSocketEvent.REMOVE_MESSAGE, () => {
      dispatch(getPossiblyUpdatedMessages());
    });
    WebSocketUtils.registerEventHandler(WebSocketEvent.EDIT_MESSAGE, () => {
      dispatch(getPossiblyUpdatedMessages());
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
