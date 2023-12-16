import { Avatar, Typography } from 'antd';
import { useAppSelector } from '../../../../Store';
import ChatMessage from '../../../../models/chat-message';
import { User } from '../../../../models/user';
import styles from './ChatBox.module.css';
import VirtualComponent from '../../../../components/virtual-component/VirtualComponent';
import { Constant } from '../../../../models/enums/constant';

interface Props {
  readonly messages: ChatMessage[];
  readonly owner: User;
}

interface ChatMessageComponentProps {
  readonly message: ChatMessage;
}

interface OtherChatMessageComponentProps extends ChatMessageComponentProps {
  readonly isFirstMessage: boolean;
}

interface CurrentMessageGroupProps {
  readonly messages: ChatMessage[];
}

const CurrentUserMessage = ({ message }: ChatMessageComponentProps) => {
  return (
    <Typography.Text
      className={styles.message}
      title={message.sentDate.toString() as unknown as string}
      key={message.id}
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
      <div className={styles.otherMessageContainer} key={message.id}>
        <span className={styles.dummyAvatar}></span>
        <Typography.Text
          className={styles.otherMessage}
          title={message.sentDate.toString() as unknown as string}
        >
          {message.content.text}
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className={styles.otherMessageContainer} key={message.id}>
      <Avatar size={30} shape='circle' src={message.owner.avatarUrl} />
      <Typography.Text
        className={styles.otherMessage}
        title={message.sentDate.toString() as unknown as string}
      >
        {message.content.text}
      </Typography.Text>
    </div>
  );
};

const useLatestMessageIdOfCurrentUser = (conversationId: number) => {
  const currentUser = useAppSelector((state) => state.user.profile);
  const messageState = useAppSelector((state) => state.chat.messageState);
  const currentUserMessages = messageState[conversationId].messages.filter((message) =>
    message.owner.equals(currentUser),
  );
  let latestMessageId = Number.MIN_SAFE_INTEGER;

  currentUserMessages.forEach((message) => {
    latestMessageId = Math.max(latestMessageId, message.id);
  });

  return latestMessageId;
};

const CurrentUserMessageGroup = ({ messages }: CurrentMessageGroupProps) => {
  const firstMessage = messages[0];
  const messageState = useAppSelector((state) => state.chat.messageState);
  const conversationId = firstMessage.conversationId;
  const currentUser = firstMessage.owner;
  const conversation = useAppSelector((state) =>
    state.chat.conversationState.conversations.find(
      (conversation) => conversation.id === conversationId,
    ),
  );

  if (conversation == null) {
    throw new Error('Invalid conversation id');
  }

  const latestMessageId = useLatestMessageIdOfCurrentUser(conversationId);
  const sent = messageState[conversationId].sent;

  const hasSendingError = messages.some(
    (message) => messageState[conversationId].sendingError[message.id],
  );

  const otherReadStatus = conversation.getOtherReadStatus(currentUser);
  const containsLatestMessage = messages.some(
    (message) => message.id === latestMessageId,
  );

  const messagesView = messages.map((message, index) => {
    const shouldShowReadStatus = message.id === otherReadStatus.latestReadMessageId;
    const readStatus = shouldShowReadStatus ? (
      <Avatar
        size={15}
        className={styles.messageStatus}
        shape='circle'
        src={otherReadStatus.readBy.avatarUrl}
      />
    ) : null;

    const shouldShowSendingStatus =
      !hasSendingError &&
      !shouldShowReadStatus &&
      containsLatestMessage &&
      index === messages.length - 1;

    const sendingStatus = shouldShowSendingStatus ? (
      <Typography.Text type='secondary' className={styles.messageStatus}>
        {sent ? 'Sent' : 'Sending'}
      </Typography.Text>
    ) : null;

    return (
      <>
        <CurrentUserMessage message={message} key={message.id} />
        {readStatus}
        {sendingStatus}
      </>
    );
  });

  return (
    <VirtualComponent scrollAreaId={Constant.ChatMessageScrollAreaId as string}>
      <div className={styles.currentUserMessagesGroup}>{messagesView}</div>
    </VirtualComponent>
  );
};

const OtherUserMessageGroup = ({ messages }: CurrentMessageGroupProps) => {
  return (
    <VirtualComponent scrollAreaId={Constant.ChatMessageScrollAreaId as string}>
      <div className={styles.otherUserMessagesGroup}>
        {messages.map((message, index) => (
          <OtherUserMessage
            message={message}
            isFirstMessage={index === messages.length - 1}
          />
        ))}
      </div>
    </VirtualComponent>
  );
};

const MessageGroup = ({ messages, owner }: Props) => {
  const currentUser = useAppSelector((state) => state.user.profile);

  if (owner.equals(currentUser)) {
    return <CurrentUserMessageGroup messages={messages} />;
  }

  return <OtherUserMessageGroup messages={messages} />;
};

export default MessageGroup;
