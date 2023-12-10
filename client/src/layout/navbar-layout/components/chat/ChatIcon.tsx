import { CommentOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import styles from './ChatIcon.module.css';
import EmbeddedConversationPreview from './EmbeddedConversationsPreview';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';

const ChatIcon = () => {
  return (
    <AuthenticatedGuard
      component={
        <Popover
          content={<EmbeddedConversationPreview />}
          placement='bottom'
          trigger='click'
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
