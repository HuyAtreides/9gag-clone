import {
  AlertFilled,
  AlertOutlined,
  AudioMutedOutlined,
  CloseOutlined,
  DeleteOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Empty, List, Modal, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addNewMessage,
  deleteChat,
  fetchAllMessageUpToId,
  mute,
  readConversation,
  reply,
  unMute,
} from '../../../../Store/chat/chat-dispatchers';
import { closeConversation } from '../../../../Store/chat/chat-slice';
import { unblock } from '../../../../Store/user-summary/user-summary-dispatcher';
import { restrict, unRestrict } from '../../../../Store/user/user-dipatchers';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import { ChatBoxHeight } from '../../../../context/chat-box-height';
import ChatConversation from '../../../../models/chat-conversation';
import { Constant } from '../../../../models/enums/constant';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
import PinnedChatMessageDialog from '../PinnedChatMessage/PinnedChatMessageDialog';
import styles from './ChatBox.module.css';
import ChatBoxSkeleton from './ChatBoxSkeleton';
import ChatBoxWithError from './ChatBoxWithError';
import ChatMessageEditor from './ChatMessageEditor';
import ChatMessageList from './ChatMessagesList';

interface Props {
  readonly chatParticipantId: number;
}

export const ChatMessageFocusFunction = React.createContext<(id: number) => void>(
  (_: number) => {},
);

const ChatStatus = ({ conversation }: { conversation: ChatConversation }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.profile);
  const otherUser = conversation.getOtherParticipant(currentUser!);
  const [loading, setLoading] = useState(false);

  const handleUnblock = async () => {
    setLoading(true);
    await dispatch(unblock(otherUser.id));
    setLoading(false);
  };

  const handleUnrestrict = async () => {
    setLoading(true);
    await dispatch(unRestrict(otherUser.id));
    setLoading(false);
  };

  if (conversation.unavailable) {
    return (
      <Empty
        image={null}
        imageStyle={{ height: 'auto' }}
        description='This account is unavailable.'
      />
    );
  }

  if (conversation.blocked) {
    return (
      <Empty
        image={
          <Typography.Title
            level={5}
          >{`You blocked ${otherUser.displayName}`}</Typography.Title>
        }
        imageStyle={{ height: 'auto' }}
        description="You can't message them in this chat, and you won't receive their messages."
      >
        <Button loading={loading} block onClick={handleUnblock}>
          Unblock
        </Button>
      </Empty>
    );
  }

  if (conversation.restricted) {
    return (
      <Empty
        image={
          <Typography.Title
            level={5}
          >{`You restricted ${otherUser.displayName}`}</Typography.Title>
        }
        imageStyle={{ height: 'auto' }}
        description="You won't receive notification when they send you message."
      >
        <Button block onClick={handleUnrestrict} loading={loading}>
          Unrestricted
        </Button>
      </Empty>
    );
  }

  return (
    <Empty
      image={
        <Typography.Title
          level={5}
        >{`${otherUser.displayName} only received messages from followers`}</Typography.Title>
      }
      imageStyle={{ height: 'auto' }}
      description={`Follow to message ${otherUser.displayName}.`}
    ></Empty>
  );
};

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

  const deleteConversation = () => {
    Modal.confirm({
      onOk: () => {
        dispatch(deleteChat(conversationId));
        return false;
      },
      title: 'Do you want to delete this conversation?',
    });
  };

  const chatParticipant = conversation.getOtherParticipant(currentUser);

  const handleMute = () => {
    if (!conversation.muted) {
      dispatch(mute(conversation.id));
    } else {
      dispatch(unMute(conversation.id));
    }
  };

  const handleRestrict = () => {
    Modal.confirm({
      onOk: async () => {
        await dispatch(restrict(openConversation.userId));
      },
      title: 'Do you want to restrict this user?',
    });
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
              {conversation.restricted ? null : (
                <Button
                  block
                  type='text'
                  icon={<AudioMutedOutlined />}
                  onClick={handleRestrict}
                >
                  Restrict
                </Button>
              )}
              <Button
                block
                type='text'
                danger
                icon={<DeleteOutlined />}
                onClick={deleteConversation}
              >
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
        conversation.canChat() ? (
          <ChatMessageEditor
            handleSubmit={handleSubmit}
            handleFocus={markAsRead}
            disabled={isMessagesLoading}
            replyingToMessage={replyingToMessage || undefined}
          />
        ) : (
          <ChatStatus conversation={conversation} />
        ),
      ]}
    >
      <ChatMessageFocusFunction.Provider value={(id) => focusMessage(id)}>
        <ChatBoxHeight.Provider
          value={
            replyingToMessage || (!conversation.unavailable && !conversation.canChat())
              ? chatBoxHeight - 70
              : chatBoxHeight
          }
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
