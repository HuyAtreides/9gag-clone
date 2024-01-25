import { Avatar, Button, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  edit,
  pin,
  remove,
  resendMessage,
  unPin,
} from '../../../../Store/chat/chat-dispatchers';
import VirtualComponent from '../../../../components/virtual-component/VirtualComponent';
import useOpenConversation from '../../../../custom-hooks/use-open-conversation';
import ChatMessage from '../../../../models/chat-message';
import { Constant } from '../../../../models/enums/constant';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
import { User } from '../../../../models/user';
import styles from './ChatBox.module.css';
import ChatMessageContent from './ChatMessageContent';
import ChatMessageEditor from './ChatMessageEditor';
import ChatMessagePopover from './ChatMessagePopover';
import { setReplyingToMessage } from '../../../../Store/chat/chat-slice';

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

const useIsBeingSent = (message: ChatMessage) => {
  const conversationId = message.conversationId;
  const sendingIds = useAppSelector(
    (state) => state.chat.messageState[conversationId].sendingIds,
  );
  const isBeingSent = sendingIds.includes(message.id);

  return isBeingSent;
};

const PinButton = ({ message }: { message: ChatMessage }) => {
  const dispatch = useAppDispatch();
  const isBeingSent = useIsBeingSent(message);

  const handlePin = () => {
    if (message.pinned) {
      dispatch(unPin(message.conversationId, message.id));
    } else {
      dispatch(pin(message.conversationId, message.id));
    }
  };

  return (
    <Button type='text' block onClick={handlePin} disabled={isBeingSent}>
      {message.pinned ? 'Unpin' : 'Pin'}
    </Button>
  );
};

const ReplyButton = ({ message }: { message: ChatMessage }) => {
  const dispatch = useAppDispatch();
  const conversationId = message.conversationId;
  const isBeingSent = useIsBeingSent(message);

  const handleReply = () => {
    dispatch(setReplyingToMessage({ conversationId, message }));
  };

  return (
    <Button
      type='text'
      block
      title={isBeingSent ? 'This message is being sent' : undefined}
      disabled={isBeingSent}
      onClick={handleReply}
    >
      Reply
    </Button>
  );
};

const CurrentUserMessage = ({ message }: ChatMessageComponentProps) => {
  const dispatch = useAppDispatch();
  const openConversations = useAppSelector(
    (state) => state.chat.conversationState.openConversations,
  );
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const conversationId = message.conversationId;
  const conversation = openConversations.find(
    (openConversation) => openConversation.conversation?.id === conversationId,
  )?.conversation;
  const removeMessage = () => {
    dispatch(remove(conversationId, message.id));
  };
  const isBeingSent = useIsBeingSent(message);

  const handleEditMessage = (formData: NewChatMessageFormData) => {
    dispatch(edit(conversationId, message.id, formData));
  };

  if (showMessageEditor) {
    return (
      <ChatMessageEditor
        message={message}
        handleSubmit={handleEditMessage}
        editMessage
        handleCancel={() => setShowMessageEditor(false)}
      />
    );
  }

  return (
    <ChatMessagePopover
      placement='left'
      actionButtons={
        <>
          {conversation?.canChat() ? (
            <>
              <Button type='text' block onClick={removeMessage} disabled={isBeingSent}>
                Remove
              </Button>
              <ReplyButton message={message} />
              <Button
                type='text'
                block
                onClick={() => setShowMessageEditor(true)}
                disabled={isBeingSent}
              >
                Edit
              </Button>
              <PinButton message={message} />
            </>
          ) : null}
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
  const openConversations = useAppSelector(
    (state) => state.chat.conversationState.openConversations,
  );
  const conversation = openConversations.find(
    (openConversation) => openConversation.conversation?.id === message.conversationId,
  )?.conversation;

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
            {conversation?.canChat() ? (
              <>
                <ReplyButton message={message} />
                <PinButton message={message} />
              </>
            ) : null}
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

const useLatestReadMessageOfOtherUser = (conversationId: number) => {
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
    dispatch(resendMessage(message.conversationId, message.id));
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
  const latestReadMessageId = useLatestReadMessageOfOtherUser(conversationId);
  const sent = messageState[conversationId].sent;
  const otherReadStatus = useOtherReadStatus(conversationId);

  const messagesView = messages.map((message, index) => {
    const shouldShowReadStatus = message.id === latestReadMessageId;
    const latestMessage = message.id === latestMessageId;
    const hasSendingError = messageState[conversationId].sendingError[message.id];
    const readStatus = shouldShowReadStatus ? (
      <Tooltip
        trigger='hover'
        placement='top'
        showArrow={false}
        title={`Read by ${
          otherReadStatus.readBy.displayName
        } at ${otherReadStatus.readAt.toLocaleString()}`}
      >
        <Avatar
          size={15}
          className={styles.messageStatus}
          shape='circle'
          src={otherReadStatus.readBy.avatarUrl}
        />
      </Tooltip>
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
      <div id={`${Constant.ChatMessageElementIdPrefix}${message.id}`}>
        <VirtualComponent
          scrollAreaId={Constant.ChatMessageScrollAreaId as string}
          key={message.id}
        >
          <CurrentUserMessage message={message} />
          {readStatus}
          {sendingStatus}
          {hasSendingError ? <ErrorWhileSending message={message} /> : null}
        </VirtualComponent>
      </div>
    );
  });

  return <div className={styles.currentUserMessagesGroup}>{messagesView}</div>;
};

const OtherUserMessageGroup = ({ messages }: CurrentMessageGroupProps) => {
  return (
    <div className={styles.otherUserMessagesGroup}>
      {messages.map((message, index) => (
        <div id={`${Constant.ChatMessageElementIdPrefix}${message.id}`}>
          <VirtualComponent
            scrollAreaId={Constant.ChatMessageScrollAreaId as string}
            key={message.id}
          >
            <OtherUserMessage
              message={message}
              isFirstMessage={index === messages.length - 1}
            />
          </VirtualComponent>
        </div>
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
