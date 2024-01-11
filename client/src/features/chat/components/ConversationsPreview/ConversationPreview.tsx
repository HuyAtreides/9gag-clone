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
import ChatMessage from '../../../../models/chat-message';
import { MediaType } from '../../../../models/enums/constant';
import { User } from '../../../../models/user';
import { getMediaTypeFromMIME } from '../../../../utils/mime-type';
import styles from './ConversationPreview.module.css';
import { setConversation } from '../../../../Store/chat/chat-slice';

interface Props {
  readonly conversation: ChatConversation;
  readonly standAlone?: boolean;
}

interface PreviewMessageProps extends Props {
  readonly unread: boolean;
}

const getPreviewMessageText = (currentUser: User, message: ChatMessage) => {
  const belongToCurrentUser = message.owner.equals(currentUser);
  const { content } = message;

  if (content.text != null) {
    return belongToCurrentUser ? `You: ${content.text}` : content.text;
  }

  const { mediaType, mediaUrl } = content;

  if (!mediaType || !mediaUrl) {
    return null;
  }

  const type = getMediaTypeFromMIME(mediaType);

  if (type === MediaType.Image) {
    return belongToCurrentUser ? 'You: Sent an image' : 'Sent an image';
  }

  if (type === MediaType.Gif) {
    return belongToCurrentUser ? 'You: Sent a GIF' : 'Sent a GIF';
  }

  if (type === MediaType.Video) {
    return belongToCurrentUser ? 'You: Sent a video' : 'Sent a video';
  }

  return belongToCurrentUser ? 'You: Sent a file' : 'Sent a file';
};

const PreviewMessageContent = ({ message }: { message: ChatMessage }) => {
  const currentUser = useAppSelector((state) => state.user.profile!);

  return <>{getPreviewMessageText(currentUser, message)}</>;
};

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
        {previewMessage.loading ? (
          'Loading message...'
        ) : (
          <PreviewMessageContent message={previewMessage.message!} />
        )}
      </Typography.Paragraph>
      <Typography.Paragraph className={styles.messageContentDate}>
        {previewMessage.loading ? null : <>&#8226; {messageDateDiff}</>}
      </Typography.Paragraph>
    </span>
  );
};

const ConversationPreview = ({ conversation, standAlone = false }: Props) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.profile!);
  const openConversations = useAppSelector(
    (state) => state.chat.conversationState.openConversations,
  );
  const isOpened =
    openConversations.find(
      (openedConversation) => openedConversation.conversation?.id === conversation.id,
    ) != null;
  const otherParticipant = conversation.getOtherParticipant(currentUser);
  const unread = !conversation.isReadByUser(currentUser);

  const previewClassName =
    isOpened && standAlone
      ? `${styles.conversationPreview} ${styles.focusConversation}`
      : `${styles.conversationPreview}`;

  useEffect(() => {
    dispatch(getPreviewMessage(conversation.id, conversation.latestChatMessageId));
  }, [dispatch, conversation.id, conversation.latestChatMessageId]);

  const openConversation = () => {
    dispatch(createNewConversation(otherParticipant.id));
    dispatch(
      setConversation({
        error: null,
        isLoading: false,
        userId: otherParticipant.id,
        conversation: conversation,
      }),
    );
    dispatch(readConversation(conversation.id));
  };

  return (
    <List.Item
      role='button'
      className={previewClassName}
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
