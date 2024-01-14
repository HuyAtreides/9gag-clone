import {
  AlertFilled,
  AlertOutlined,
  CloseOutlined,
  DeleteOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PushpinOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, List } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addNewMessage,
  fetchAllMessageUpToId,
  mute,
  readConversation,
  reply,
  unMute,
} from '../../../../Store/chat/chat-dispatchers';
import { closeConversation } from '../../../../Store/chat/chat-slice';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import { Constant } from '../../../../models/enums/constant';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
import PinnedChatMessageDialog from '../PinnedChatMessage/PinnedChatMessageDialog';
import styles from './ChatBox.module.css';
import ChatBoxSkeleton from './ChatBoxSkeleton';
import ChatBoxWithError from './ChatBoxWithError';
import ChatMessageEditor from './ChatMessageEditor';
import ChatMessageList from './ChatMessagesList';
import { ChatBoxHeight } from '../../../../context/chat-box-height';

interface Props {
  readonly chatParticipantId: number;
}

export const ChatMessageFocusFunction = React.createContext<(id: number) => void>(
  (_: number) => {},
);

const ChatBox = ({ chatParticipantId }: Props) => {
  const dispatch = useAppDispatch();
  const openConversation = useAppSelector((state) =>
    state.chat.conversationState.openConversations.find(
      (conversation) => conversation.userId === chatParticipantId,
    ),
  )!;
  const chatBoxHeight = useContext(ChatBoxHeight);
  const [openPinnedChatMessages, setOpenPinnedChatMessages] = useState(false);
  const messageState = useAppSelector((state) => state.chat.messageState);
  const currentUser = useAppSelector((state) => state.user.profile!);
  const [focusMessageId, setFocusMessageId] = useState<null | number>(null);

  useEffect(() => {
    if (focusMessageId != null && openPinnedChatMessages === false) {
      document
        .getElementById(`${Constant.ChatMessageElementIdPrefix}${focusMessageId}`)
        ?.scrollIntoView({ behavior: 'smooth' });

      setFocusMessageId(null);
    }
  }, [focusMessageId, openPinnedChatMessages]);

  if (openConversation.isLoading) {
    return <ChatBoxSkeleton />;
  }

  if (openConversation.error) {
    return (
      <ChatBoxWithError
        userId={chatParticipantId}
        errorMessage={openConversation.error}
      />
    );
  }

  const conversation = openConversation.conversation!;
  const conversationId = conversation!.id;
  const replyingToMessage = messageState[conversationId].replyingToMessage;
  const isMessagesLoading = messageState[conversationId].isLoading;

  const focusMessage = async (id: number) => {
    await dispatch(fetchAllMessageUpToId(id, conversationId));
    setFocusMessageId(id);
    setOpenPinnedChatMessages(false);
  };
  const close = () => {
    dispatch(closeConversation(chatParticipantId));
  };

  const handleSubmit = (values: NewChatMessageFormData) => {
    if (replyingToMessage) {
      dispatch(reply(replyingToMessage, values));
      return;
    }

    dispatch(addNewMessage(conversationId, values));
  };

  const markAsRead = () => {
    dispatch(readConversation(conversationId));
  };

  const chatParticipant = conversation.getOtherParticipant(currentUser);

  const handleMute = () => {
    if (!conversation.muted) {
      dispatch(mute(conversation.id));
    } else {
      dispatch(unMute(conversation.id));
    }
  };

  return (
    <Card
      title={
        <List.Item.Meta
          avatar={<Avatar src={chatParticipant?.avatarUrl} size={35} />}
          className={styles.chatBoxHeader}
          title={
            <Link to={`/user/${chatParticipant?.id}`}>
              {chatParticipant?.displayName}
            </Link>
          }
          description={chatParticipant?.username}
        />
      }
      className={styles.chatBox}
      extra={[
        <AutoClosePopover
          placement='left'
          content={
            <div className='more-action-box-container'>
              <Button block type='text' icon={<FullscreenOutlined />}>
                <Link to={`/chat/${conversation.id}`} className={styles.fullscreenLink}>
                  Open in fullscreen
                </Link>
              </Button>

              <Button
                block
                type='text'
                icon={<PushpinOutlined />}
                onClick={() => setOpenPinnedChatMessages(true)}
              >
                View pinned messages
              </Button>
              <Button
                block
                type='text'
                icon={!conversation.muted ? <AlertFilled /> : <AlertOutlined />}
                onClick={handleMute}
              >
                {!conversation.muted ? 'Mute' : 'Unmute'}
              </Button>
              <Button block type='text' icon={<StopOutlined />}>
                Restrict
              </Button>
              <Button block type='text' danger icon={<DeleteOutlined />}>
                Delete chat
              </Button>
            </div>
          }
        >
          <Button icon={<MoreOutlined />} type='text' />
        </AutoClosePopover>,
        <Button icon={<CloseOutlined />} type='text' onClick={close} />,
      ]}
      actions={[
        <ChatMessageEditor
          handleSubmit={handleSubmit}
          handleFocus={markAsRead}
          disabled={isMessagesLoading}
          replyingToMessage={replyingToMessage || undefined}
        />,
      ]}
    >
      <ChatMessageFocusFunction.Provider value={(id) => focusMessage(id)}>
        <ChatBoxHeight.Provider
          value={replyingToMessage ? chatBoxHeight - 70 : chatBoxHeight}
        >
          <ChatMessageList openConversationId={conversation.id} />
        </ChatBoxHeight.Provider>
      </ChatMessageFocusFunction.Provider>

      <PinnedChatMessageDialog
        conversationId={conversation.id}
        visible={openPinnedChatMessages}
        close={() => setOpenPinnedChatMessages(false)}
        viewPinnedMessage={focusMessage}
      />
    </Card>
  );
};

export default ChatBox;
