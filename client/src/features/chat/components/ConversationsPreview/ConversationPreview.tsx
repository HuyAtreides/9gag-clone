import { Avatar, List, Typography } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  createNewConversation,
  getPreviewMessage,
  readConversation,
} from '../../../../Store/chat/chat-dispatchers';
import useTimeDiffFromToday from '../../../../custom-hooks/use-time-diff-from-today';
import ChatConversation from '../../../../models/chat-conversation';
import styles from './ConversationPreview.module.css';

interface Props {
  readonly conversation: ChatConversation;
}

interface PreviewMessageProps extends Props {
  readonly unread: boolean;
}

const PreviewMessage = ({ conversation, unread }: PreviewMessageProps) => {
  const previewMessage = useAppSelector(
    (state) =>
      state.chat.conversationState.previewConversations.previewMessages[conversation.id],
  );
  const messageDateDiff = useTimeDiffFromToday(
    previewMessage.message?.sentDate || new Date(),
  );
  const className = unread
    ? `${styles.messageContentPreview} ${styles.latestUnreadMessagePreview}`
    : `${styles.messageContentPreview}`;

  return (
    <span className={styles.latestMessagePreview}>
      <Typography.Paragraph
        className={className}
        italic={previewMessage.loading || previewMessage.error ? true : false}
      >
        {previewMessage.loading
          ? 'Loading preview message...'
          : previewMessage.message?.content.text}
      </Typography.Paragraph>
      <Typography.Paragraph className={styles.messageContentDate}>
        {previewMessage.loading ? null : <>&#8226; {messageDateDiff}</>}
      </Typography.Paragraph>
    </span>
  );
};

const ConversationPreview = ({ conversation }: Props) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.profile!);
  const previewMessage = useAppSelector(
    (state) =>
      state.chat.conversationState.previewConversations.previewMessages[conversation.id]
        ?.message,
  );
  const otherParticipant = conversation.getOtherParticipant(currentUser);
  const currentUserReadStatus = conversation.getOtherReadStatus(otherParticipant);
  const unread = Boolean(
    previewMessage && currentUserReadStatus.readAt < previewMessage.sentDate,
  );

  useEffect(() => {
    dispatch(getPreviewMessage(conversation.id, conversation.latestChatMessageId));
  }, [dispatch, conversation]);

  const openConversation = () => {
    dispatch(createNewConversation(otherParticipant.id));
    dispatch(readConversation(conversation.id));
  };

  return (
    <List.Item
      role='button'
      className={styles.conversationPreview}
      extra={unread ? <span className={styles.unreadMark}></span> : null}
      onClick={openConversation}
    >
      <List.Item.Meta
        avatar={<Avatar src={otherParticipant.avatarUrl} />}
        title={
          <Link to={`/user/${otherParticipant.id}`}>{otherParticipant.displayName}</Link>
        }
        description={<PreviewMessage conversation={conversation} unread={unread} />}
      />
    </List.Item>
  );
};

export default ConversationPreview;
