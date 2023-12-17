import { Avatar, Typography } from 'antd';
import { useAppSelector } from '../../../../Store';
import ChatMessage from '../../../../models/chat-message';
import { User } from '../../../../models/user';
import styles from './ChatBox.module.css';
import VirtualComponent from '../../../../components/virtual-component/VirtualComponent';
import { Constant } from '../../../../models/enums/constant';
import useOpenConversation from '../../../../custom-hooks/use-open-conversation';

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
    <VirtualComponent scrollAreaId={Constant.ChatMessageScrollAreaId as string}>
      <div className={styles.otherMessageContainer} key={message.id}>
        <Avatar size={30} shape='circle' src={message.owner.avatarUrl} />
        <Typography.Text
          className={styles.otherMessage}
          title={message.sentDate.toString() as unknown as string}
        >
          {message.content.text}
        </Typography.Text>
      </div>
    </VirtualComponent>
  );
};

const useLatestMessageOfCurrentUser = (conversationId: number) => {
  const currentUser = useAppSelector((state) => state.user.profile);
  const messageState = useAppSelector((state) => state.chat.messageState);
  const currentUserMessages = messageState[conversationId].messages.filter((message) =>
    message.owner.equals(currentUser),
  );

  if (currentUserMessages.length === 0) {
    return 0;
  }

  return currentUserMessages[0].id;
};

const useOtherReadStatus = (conversationId: number) => {
  const conversation = useOpenConversation(conversationId);
  const currentUser = useAppSelector((state) => state.user.profile);

  return conversation.getOtherReadStatus(currentUser);
};

const useLatestReadMessageOfCurrentUser = (conversationId: number) => {
  const currentUser = useAppSelector((state) => state.user.profile);
  const messageState = useAppSelector((state) => state.chat.messageState);
  const currentUserMessages = messageState[conversationId].messages.filter((message) =>
    message.owner.equals(currentUser),
  );
  const otherReadStatus = useOtherReadStatus(conversationId);

  return (
    currentUserMessages.find((message) => otherReadStatus.readAt >= message.sentDate)
      ?.id || 0
  );
};

const CurrentUserMessageGroup = ({ messages }: CurrentMessageGroupProps) => {
  const firstMessage = messages[0];
  const messageState = useAppSelector((state) => state.chat.messageState);
  const conversationId = firstMessage.conversationId;
  const latestMessageId = useLatestMessageOfCurrentUser(conversationId);
  const latestReadMessageId = useLatestReadMessageOfCurrentUser(conversationId);
  const sent = messageState[conversationId].sent;
  const hasSendingError = messages.some(
    (message) => messageState[conversationId].sendingError[message.id],
  );
  const otherReadStatus = useOtherReadStatus(conversationId);

  const messagesView = messages.map((message, index) => {
    const shouldShowReadStatus = message.id === latestReadMessageId;
    const latestMessage = message.id === latestMessageId;
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
      latestMessage &&
      index === messages.length - 1;

    const sendingStatus = shouldShowSendingStatus ? (
      <Typography.Text type='secondary' className={styles.messageStatus}>
        {sent ? 'Sent' : 'Sending'}
      </Typography.Text>
    ) : null;

    return (
      <VirtualComponent
        scrollAreaId={Constant.ChatMessageScrollAreaId as string}
        key={message.id}
      >
        <CurrentUserMessage message={message} key={message.id} />
        <br />
        {readStatus}
        {sendingStatus}
      </VirtualComponent>
    );
  });

  return <div className={styles.currentUserMessagesGroup}>{messagesView}</div>;
};

const OtherUserMessageGroup = ({ messages }: CurrentMessageGroupProps) => {
  return (
    <div className={styles.otherUserMessagesGroup}>
      {messages.map((message, index) => (
        <VirtualComponent
          scrollAreaId={Constant.ChatMessageScrollAreaId as string}
          key={message.id}
        >
          <OtherUserMessage
            message={message}
            isFirstMessage={index === messages.length - 1}
          />
        </VirtualComponent>
      ))}
    </div>
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
