import { Typography } from 'antd';
import { useAppSelector } from '../../../../Store';
import ChatMessage from '../../../../models/chat-message';
import styles from './ChatBox.module.css';
import Media from '../../../../components/media/Media';
import { Constant } from '../../../../models/enums/constant';

interface Props {
  readonly message: ChatMessage;
}

const RemovedMessage = ({ belongToCurrentUser }: { belongToCurrentUser: boolean }) => {
  const className = belongToCurrentUser
    ? `${styles.message} ${styles.removedMessage}`
    : `${styles.otherMessage} ${styles.removedMessage}`;

  return (
    <Typography.Text className={className} italic type='secondary'>
      Message is removed
    </Typography.Text>
  );
};

const ChatMessageContent = ({ message }: Props) => {
  const currentUser = useAppSelector((state) => state.user.profile);
  const belongToCurrentUser = message.owner.equals(currentUser);
  const textMessageClassName = belongToCurrentUser ? styles.message : styles.otherMessage;
  const messageContentClassName = belongToCurrentUser
    ? styles.messageContent
    : styles.otherMessageContent;
  const content = message.content;
  const { mediaType, mediaUrl } = content;
  const mediaNotNull = mediaType != null && mediaUrl != null;

  if (message.deleted) {
    return <RemovedMessage belongToCurrentUser={belongToCurrentUser} />;
  }

  return (
    <div className={messageContentClassName}>
      {content.text ? (
        <Typography.Text className={textMessageClassName}>{content.text}</Typography.Text>
      ) : null}
      {mediaNotNull ? (
        <Media
          url={mediaUrl}
          type={mediaType}
          scrollAreaId='body'
          width={Constant.DefaultChatMessageMediaWidth}
          height={Constant.DefaultChatMessageMediaHeight}
          gifWidth={Constant.DefaultChatMessageMediaWidth as number}
          gifHeight={Constant.DefaultChatMessageMediaHeight as number}
        />
      ) : null}
    </div>
  );
};

export default ChatMessageContent;
