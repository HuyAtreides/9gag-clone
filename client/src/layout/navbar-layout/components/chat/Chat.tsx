import { CommentOutlined } from '@ant-design/icons';
import { Badge, Button, Popover } from 'antd';
import styles from './Chat.module.css';
import ConversationsPreview from './ConversationsPreview';

const Chat = () => {
  return (
    <Popover content={<ConversationsPreview />} trigger='click'>
      <Badge>
        <Button shape='circle' icon={<CommentOutlined />} className={styles.chatIcon} />
      </Badge>
    </Popover>
  );
};

export default Chat;
