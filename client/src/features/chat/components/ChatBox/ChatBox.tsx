import {
  AlertFilled,
  AlertOutlined,
  AudioMutedOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PushpinOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Empty, List, Modal, Typography, notification } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addNewMessage,
  allowChat,
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
import { WebSocketEvent } from '../../../../models/enums/web-socket-event';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
import {
  hangUp,
  joinVideoCallSession,
  requestMediaDevicesPermission,
  startVideoCallSession,
} from '../../../../services/video-call-service';
import { WebSocketUtils } from '../../../../utils/web-socket-utils';
import VideoCall from '../../video-call/VideoCall';
import PinnedChatMessageDialog from '../PinnedChatMessage/PinnedChatMessageDialog';
import SearchChatMessage from '../SearchChatMessage/SearchChatMessage';
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
      description={`You need to follow ${otherUser.displayName} to chat.`}
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
  const [callerVideoStream, setCallerVideoStream] = useState<MediaStream | null>(null);
  const [calleeVideoStream, setCalleeVideoStream] = useState<MediaStream | null>(null);
  const chatBoxHeight = useContext(ChatBoxHeight);
  const [openPinnedChatMessages, setOpenPinnedChatMessages] = useState(false);
  const [openSearchChatMessages, setOpenChatSearchMessage] = useState(false);
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const messageState = useAppSelector((state) => state.chat.messageState);
  const currentUser = useAppSelector((state) => state.user.profile!);
  const [callEnded, setCallEnded] = useState(false);
  const [focusMessageId, setFocusMessageId] = useState<null | number>(null);

  useEffect(() => {
    if (focusMessageId != null && openPinnedChatMessages === false) {
      document
        .getElementById(`${Constant.ChatMessageElementIdPrefix}${focusMessageId}`)
        ?.scrollIntoView({ behavior: 'smooth' });

      setFocusMessageId(null);
    }
  }, [focusMessageId, openPinnedChatMessages]);

  const assignVideoStream = (videoStream: MediaStream) => {
    setCallerVideoStream(videoStream);
  };

  const assignCalleeVideoStream = (videoStream: MediaStream) => {
    setCalleeVideoStream(videoStream);
  };

  const cleanUpAfterEndCall = () => {
    window.location.reload();
  };

  const notifyBeforeCleanUp = () => {
    setCallEnded(true);

    setTimeout(() => {
      cleanUpAfterEndCall();
    }, 2000);
  };

  useEffect(() => {
    WebSocketUtils.registerEventHandler(
      WebSocketEvent.VIDEO_OFFER,
      async (videoOfferAsString) => {
        setOpenVideoCall(true);
        const videoStream = await requestMediaDevicesPermission();
        assignVideoStream(videoStream);
        joinVideoCallSession(
          videoOfferAsString,
          videoStream,
          assignCalleeVideoStream,
          notifyBeforeCleanUp,
        );
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (conversation.needConfirmationBeforeSendingMessage) {
      Modal.confirm({
        onOk: async () => {
          await dispatch(allowChat(conversationId));
          sendMessage(values);
          return false;
        },
        title:
          'This user is not your followers, send this message will allow the user to chat with you.',
      });
      return;
    }

    sendMessage(values);
  };

  const sendMessage = (values: NewChatMessageFormData) => {
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

  const startVideoCall = async () => {
    setOpenVideoCall(true);
    const mediaStream = await requestMediaDevicesPermission();
    assignVideoStream(mediaStream);
    await startVideoCallSession(
      currentUser.id,
      chatParticipant.id,
      mediaStream,
      assignCalleeVideoStream,
      cleanUpAfterEndCall,
    );
  };

  const endCall = () => {
    hangUp(chatParticipant.id, cleanUpAfterEndCall);
  };

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
                icon={<VideoCameraOutlined />}
                onClick={startVideoCall}
              >
                Video call
              </Button>

              <Button
                block
                type='text'
                icon={<FileSearchOutlined />}
                onClick={() => setOpenChatSearchMessage(true)}
              >
                Search messages
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

      {openVideoCall ? (
        <VideoCall
          callEnded={callEnded}
          close={endCall}
          callerVideoStream={callerVideoStream}
          calleeVideoStream={calleeVideoStream}
        />
      ) : null}

      <PinnedChatMessageDialog
        conversationId={conversation.id}
        visible={openPinnedChatMessages}
        close={() => setOpenPinnedChatMessages(false)}
        viewPinnedMessage={focusMessage}
      />
      <SearchChatMessage
        conversationId={conversation.id}
        visible={openSearchChatMessages}
        close={() => setOpenChatSearchMessage(false)}
        viewMessage={focusMessage}
      />
    </Card>
  );
};

export default ChatBox;
