import { CommentOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import styles from './ChatIcon.module.css';
import EmbeddedConversationPreview from './EmbeddedConversationsPreview';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import { useEffect, useState } from 'react';
import { WebSocketUtils } from '../../../../utils/web-socket-utils';
import { useAppDispatch } from '../../../../Store';
import { WebSocketEvent } from '../../../../models/enums/web-socket-event';
import {
  getLatestConversationsState,
  updateOpenConversation,
} from '../../../../Store/chat/chat-dispatchers';

const ChatIcon = () => {
  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    WebSocketUtils.registerEventHandler(WebSocketEvent.RECEIVE_NEW_MESSAGE, () => {
      dispatch(getLatestConversationsState());
    });
    WebSocketUtils.registerEventHandler(WebSocketEvent.MARK_AS_READ, () => {
      dispatch(updateOpenConversation());
    });
  }, [dispatch]);

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
          <Badge>
            <Button
              onClick={() => setVisible(true)}
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
