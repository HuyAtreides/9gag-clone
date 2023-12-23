import { Avatar, Button, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import VirtualComponent from '../../../../components/virtual-component/VirtualComponent';
import useOpenConversation from '../../../../custom-hooks/use-open-conversation';
import ChatMessage from '../../../../models/chat-message';
import { Constant } from '../../../../models/enums/constant';
import { User } from '../../../../models/user';
import styles from './ChatBox.module.css';
import ChatMessageContent from './ChatMessageContent';
import ChatMessagePopover from './ChatMessagePopover';
import { addNewMessage, remove } from '../../../../Store/chat/chat-dispatchers';
import ChatMessageEditor from './ChatMessageEditor';

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
  const dispatch = useAppDispatch();

  const removeMessage = () => {
    dispatch(remove(message.conversationId, message.id));
  };

  return (
    <ChatMessagePopover
      placement='left'
      actionButtons={
        <>
          <Button type='text' block onClick={removeMessage}>
            Remove
          </Button>
          <Button type='text' block>
            Reply
          </Button>
          <Button type='text' block>
            Edit
          </Button>
          <Button type='text' block>
            Pin
          </Button>
        </>
      }
      message={message}
    >
      <ChatMessageContent message={message} />
    </ChatMessagePopover>
  );
};

const OtherUserMessage = ({
  message,
  isFirstMessage,
}: OtherChatMessageComponentProps) => {
  return (
    <div className={styles.otherMessageContainer} key={message.id}>
      {isFirstMessage ? (
        <Avatar size={30} shape='circle' src={message.owner.avatarUrl} />
      ) : (
        <span className={styles.dummyAvatar}></span>
      )}
      <ChatMessagePopover
        placement='right'
        actionButtons={
          <>
            <Button type='text' block>
              Reply
            </Button>
            <Button type='text' block>
              Pin
            </Button>
          </>
        }
        message={message}
      >
        <ChatMessageContent message={message} />
      </ChatMessagePopover>
    </div>
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

const ErrorWhileSending = ({ message }: { message: ChatMessage }) => {
  const dispatch = useAppDispatch();

  const resend = () => {
    dispatch(
      addNewMessage(message.conversationId, {
        text: message.content.text || undefined,
        file: message.content.uploadFile,
      }),
    );
  };

  return (
    <Typography.Text type='danger' strong italic className={styles.sendingError}>
      Error while sending.{' '}
      <Button type='text' className={styles.resendButton} danger onClick={resend}>
        <Typography.Text type='danger' strong italic>
          Resend
        </Typography.Text>
      </Button>
    </Typography.Text>
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
        <CurrentUserMessage message={message} />
        {readStatus}
        {sendingStatus}
        {hasSendingError ? <ErrorWhileSending message={message} /> : null}
        {/* <>
          <br />
          <ChatMessageEditor handleSubmit={() => {}} message={message} />
          <br />
        </> */}
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
