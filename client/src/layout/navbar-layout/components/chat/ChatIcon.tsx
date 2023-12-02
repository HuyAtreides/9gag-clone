import { CommentOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import styles from './ChatIcon.module.css';
import EmbeddedConversationPreview from './EmbeddedConversationsPreview';

const ChatIcon = () => {
  return (
    <Popover content={<EmbeddedConversationPreview />} trigger='click'>
      <Badge>
        <Button shape='circle' icon={<CommentOutlined />} className={styles.chatIcon} />
      </Badge>
    </Popover>
  );
};

export default ChatIcon;
