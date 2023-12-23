import { CloseOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, List } from 'antd';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { addNewMessage, readConversation } from '../../../../Store/chat/chat-dispatchers';
import { closeConversation } from '../../../../Store/chat/chat-slice';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
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
  const messageState = useAppSelector((state) => state.chat.messageState);
  const currentUser = useAppSelector((state) => state.user.profile!);

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
  const close = () => {
    dispatch(closeConversation(chatParticipantId));
  };

  const handleSubmit = (values: NewChatMessageFormData) => {
    dispatch(addNewMessage(conversationId, values));
  };

  const markAsRead = () => {
    dispatch(readConversation(conversationId));
  };

  const chatParticipant = openConversation.conversation!.getOtherParticipant(currentUser);

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
        <Button icon={<MoreOutlined />} type='text' />,
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
      <ChatMessageList openConversationId={openConversation.conversation!.id} />
    </Card>
  );
};

export default ChatBox;
