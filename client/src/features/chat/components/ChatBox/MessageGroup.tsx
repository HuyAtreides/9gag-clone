import { Avatar, Typography } from 'antd';
import { useAppSelector } from '../../../../Store';
import ChatMessage from '../../../../models/chat-message';
import styles from './ChatBox.module.css';
import { send } from 'process';

interface Props {
  readonly messages: ChatMessage[];
}

interface ChatMessageComponentProps {
  readonly message: ChatMessage;
}

interface OtherChatMessageComponentProps extends ChatMessageComponentProps {
  readonly isFirstMessage: boolean;
}

const CurrentUserMessage = ({ message }: ChatMessageComponentProps) => {
  return (
    <Typography.Text
      className={styles.message}
      title={message.sentDate.toString() as unknown as string}
    >
      {message.content.text}
    </Typography.Text>
  );
};

const OtherUserMessage = ({
  message,
  isFirstMessage,
}: OtherChatMessageComponentProps) => {
  if (!isFirstMessage) {
    return (
      <div className={styles.otherMessageContainer}>
        <span className={styles.dummyAvatar}></span>
        <Typography.Text className={styles.otherMessage}>
          {message.content.text}
        </Typography.Text>
      </div>
    );
  }

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
  const messageState = useAppSelector((state) => state.chat.messageState);
  const firstMessage = messages[0];
  const sender = firstMessage.owner;
  const conversationId = firstMessage.conversationId;
  const sent = messageState[conversationId].sent;

  if (currentUser?.id === sender.id) {
    return (
      <div className={styles.currentUserMessagesGroup}>
        {messages.map((message) => (
          <CurrentUserMessage message={message} />
        ))}
        {/* <Avatar
          size={15}
          className={styles.messageStatus}
          shape='circle'
          src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp'
        /> */}
        <Typography.Text type='secondary' className={styles.messageStatus}>
          {sent ? 'Sent' : 'Sending'}
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className={styles.otherUserMessagesGroup}>
      {messages.map((message, index) => {
        return (
          <OtherUserMessage
            message={message}
            isFirstMessage={index === messages.length - 1}
          />
        );
      })}
    </div>
  );
};

export default MessageGroup;
