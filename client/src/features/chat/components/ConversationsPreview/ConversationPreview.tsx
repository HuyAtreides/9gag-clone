import { Avatar, List, Typography } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { getPreviewMessage } from '../../../../Store/chat/chat-dispatchers';
import useTimeDiffFromToday from '../../../../custom-hooks/use-time-diff-from-today';
import ChatConversation from '../../../../models/chat-conversation';
import styles from './ConversationPreview.module.css';

interface Props {
  readonly conversation: ChatConversation;
}

const PreviewMessage = ({ conversation }: Props) => {
  const previewMessage = useAppSelector(
    (state) =>
      state.chat.conversationState.previewConversations.previewMessages[conversation.id],
  );
  const messageDateDiff = useTimeDiffFromToday(
    previewMessage.message?.sentDate || new Date(),
  );

  return (
    <span className={styles.latestMessagePreview}>
      <Typography.Paragraph
        className={styles.messageContentPreview}
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
  const otherParticipant = conversation.getOtherParticipant(currentUser);

  useEffect(() => {
    dispatch(getPreviewMessage(conversation.id, conversation.latestChatMessageId));
  }, [dispatch, conversation]);

  return (
    <List.Item
      role='button'
      className={styles.conversationPreview}
      extra={<span className={styles.unreadMark}></span>}
    >
      <List.Item.Meta
        avatar={<Avatar src={otherParticipant.avatarUrl} />}
        title={
          <Link to={`/user/${otherParticipant.id}`}>{otherParticipant.displayName}</Link>
        }
        description={<PreviewMessage conversation={conversation} />}
      />
    </List.Item>
  );
};

export default ConversationPreview;
