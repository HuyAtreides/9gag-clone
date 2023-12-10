import { Avatar, Typography } from 'antd';
import { useAppSelector } from '../../../../Store';
import ChatMessage from '../../../../models/chat-message';
import styles from './ChatBox.module.css';

interface Props {
  readonly messages: ChatMessage[];
}

interface ChatMessageComponentProps {
  readonly message: ChatMessage;
}

const CurrentUserMessage = ({ message }: ChatMessageComponentProps) => {
  return (
    <Typography.Text className={styles.message}>{message.content.text}</Typography.Text>
  );
};

const OtherUserMessage = ({ message }: ChatMessageComponentProps) => {
  return (
    <div className={styles.otherMessageContainer}>
      <Avatar size={30} shape='circle' src={message.owner.avatarUrl} />
      <Typography.Text className={styles.otherMessage}>
        {message.content.text}
      </Typography.Text>
    </div>
  );
};

const MessageGroup = ({ messages }: Props) => {
  const currentUser = useAppSelector((state) => state.user.profile);
  const firstMessage = messages[0];
  const sender = firstMessage.owner;
  const conversationId = firstMessage.conversationId;

  if (currentUser?.id === sender.id) {
    return (
      <div className={styles.currentUserMessagesGroup}>
        {messages.map((message) => (
          <CurrentUserMessage message={message} />
        ))}
        <Avatar
          size={15}
          className={styles.messageStatus}
          shape='circle'
          src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp'
        />
        {/* <Typography.Text type='secondary' className={styles.messageStatus}>
          Sent
        </Typography.Text> */}
      </div>
    );
  }

  return (
    <div className={styles.otherUserMessagesGroup}>
      {messages.map((message) => (
        <OtherUserMessage message={message} />
      ))}
    </div>
  );
};

export default MessageGroup;
