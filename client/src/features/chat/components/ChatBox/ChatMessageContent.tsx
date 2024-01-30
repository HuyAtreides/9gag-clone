import { PaperClipOutlined, PushpinFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import { useAppSelector } from '../../../../Store';
import Media from '../../../../components/media/Media';
import ChatMessage from '../../../../models/chat-message';
import { Constant, MediaType } from '../../../../models/enums/constant';
import styles from './ChatBox.module.css';
import ReplyToMessagePreview from '../ReplyToMessage/ReplyToMessagePreview';
import { useContext } from 'react';
import { ChatMessageFocusFunction } from './ChatBox';

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
  const setFocusMessage = useContext(ChatMessageFocusFunction);
  const textMessageClassName = belongToCurrentUser ? styles.message : styles.otherMessage;
  const messageContentClassName = belongToCurrentUser
    ? styles.messageContent
    : styles.otherMessageContent;
  const content = message.content;
  const { mediaType, mediaUrl, uploadFile } = content;
  const mediaNotNull = mediaType != null && mediaUrl != null;
  const isFile = mediaType === MediaType.File;

  const handleFocus = () => {
    if (message.replyToMessage) {
      setFocusMessage(message.replyToMessage.id);
    }
  };

  if (message.deleted) {
    return <RemovedMessage belongToCurrentUser={belongToCurrentUser} />;
  }

  return (
    <div className={messageContentClassName}>
      {message.pinned ? (
        <Typography.Text type='secondary' className={styles.pinMessage}>
          Pinned <PushpinFilled className={styles.messagePinIcon} />
        </Typography.Text>
      ) : null}

      {message.replyToMessage ? (
        <div
          className={styles.replyToMessageContainer}
          role='button'
          onClick={handleFocus}
        >
          <ReplyToMessagePreview message={message.replyToMessage} />
        </div>
      ) : null}

      {content.text ? (
        <Typography.Text className={textMessageClassName}>{content.text}</Typography.Text>
      ) : null}
      {mediaNotNull && !isFile ? (
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

      {isFile ? (
        <a href={mediaUrl || undefined} download className={styles.fileNameContainer}>
          <PaperClipOutlined />
          <Typography.Link className={styles.fileName}>
            {uploadFile?.name}
          </Typography.Link>
        </a>
      ) : null}
    </div>
  );
};

export default ChatMessageContent;
