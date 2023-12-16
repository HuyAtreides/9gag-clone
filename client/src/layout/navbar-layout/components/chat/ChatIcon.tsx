import { CommentOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import styles from './ChatIcon.module.css';
import EmbeddedConversationPreview from './EmbeddedConversationsPreview';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import { useEffect } from 'react';
import { WebSocketUtils } from '../../../../utils/web-socket-utils';
import { useAppDispatch } from '../../../../Store';
import { WebSocketEvent } from '../../../../models/enums/web-socket-event';
import { getLatestConversationsState } from '../../../../Store/chat/chat-dispatchers';

const ChatIcon = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    WebSocketUtils.registerEventHandler(WebSocketEvent.RECEIVE_NEW_MESSAGE, () => {
      dispatch(getLatestConversationsState());
    });
  }, [dispatch]);

  return (
    <AuthenticatedGuard
      component={
        <Popover
          content={<EmbeddedConversationPreview />}
          placement='bottom'
          trigger='click'
          destroyTooltipOnHide={false}
          getPopupContainer={(container) => container.parentElement!}
        >
          <Badge>
            <Button
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
