import { CloseOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, List } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addNewMessage,
  fetchAllMessageUpToId,
  readConversation,
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

interface Props {
  readonly chatParticipantId: number;
}

const ChatBox = ({ chatParticipantId }: Props) => {
  const dispatch = useAppDispatch();
  const openConversation = useAppSelector((state) =>
    state.chat.conversationState.openConversations.find(
      (conversation) => conversation.userId === chatParticipantId,
    ),
  )!;
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

  const conversationId = openConversation.conversation!.id;
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
    dispatch(addNewMessage(conversationId, values));
  };

  const markAsRead = () => {
    dispatch(readConversation(conversationId));
  };

  const conversation = openConversation.conversation!;
  const chatParticipant = conversation.getOtherParticipant(currentUser);

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
              <Button block type='text' onClick={() => setOpenPinnedChatMessages(true)}>
                View pinned messages
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
        />,
      ]}
    >
      <ChatMessageList openConversationId={conversation.id} />
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
