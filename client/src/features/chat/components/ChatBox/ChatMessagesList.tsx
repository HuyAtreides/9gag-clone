import { Avatar, Typography } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addNewMessagePage,
  getMessagePage,
} from '../../../../Store/chat/chat-dispatchers';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import ChatMessage from '../../../../models/chat-message';
import { Constant } from '../../../../models/enums/constant';
import PageOptions from '../../../../models/page-options';
import styles from './ChatBox.module.css';
import MessageGroup from './MessageGroup';

interface Props {
  readonly openConversationIndex: number;
}

const groupMessages = (messages: ChatMessage[]) => {
  const chatMessageGroups = [];
  let messagesInSameGroup: ChatMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i];
    const nextMessage = messages[Math.min(messages.length - 1, i + 1)];

    messagesInSameGroup.push(currentMessage);

    if (!currentMessage.owner.equals(nextMessage.owner)) {
      chatMessageGroups.push(<MessageGroup messages={messagesInSameGroup} />);
      messagesInSameGroup = [];
    }
  }

  if (messagesInSameGroup.length > 0) {
    chatMessageGroups.push(<MessageGroup messages={messagesInSameGroup} />);
  }

  return chatMessageGroups;
};

const ChatMessageList = ({ openConversationIndex }: Props) => {
  const dispatch = useAppDispatch();
  const openConversation = useAppSelector(
    (state) => state.chat.conversationState.openConversations[openConversationIndex],
  );
  const conversation = openConversation.conversation!;
  const currentUser = useAppSelector((state) => state.user.profile!);
  const chatParticipant = conversation.getOtherParticipant(currentUser);
  const conversationId = conversation.id;
  const { pagination, messages, isGettingPage, isLoading, gettingPageError } =
    useAppSelector((state) => state.chat.messageState[conversationId]);

  const getNextPage = () => {
    if (isGettingPage) {
      return;
    }

    const pageOptions: PageOptions = {
      page: pagination.page + 1,
      size: Constant.PageSize as number,
    };

    const pageFetchingRequest = {
      pageOptions,
      conversationId,
    };

    dispatch(addNewMessagePage(pageFetchingRequest));
  };

  useEffect(() => {
    const pageOptions: PageOptions = {
      page: 0,
      size: Constant.PageSize as number,
    };
    const pageFetchingRequest = {
      pageOptions,
      conversationId,
    };

    dispatch(getMessagePage(pageFetchingRequest));
  }, [dispatch, conversationId]);

  if (isLoading) {
    return (
      <InfiniteScroll
        hasMore={false}
        next={() => {}}
        dataLength={0}
        loader
        height={window.innerHeight * 0.45}
        className={styles.chatBoxMessageLoading}
      >
        <CenterSpinner />
      </InfiniteScroll>
    );
  }

  return (
    <InfiniteScroll
      hasMore={!pagination.isLast}
      next={getNextPage}
      dataLength={messages.length}
      loader={<CenterSpinner />}
      height={window.innerHeight * 0.45}
      className={styles.chatBoxContent}
    >
      {groupMessages(messages)}

      {pagination.isLast && !gettingPageError ? (
        <div className={styles.chatParticipantInfo}>
          <Avatar size={100} shape='circle' src={chatParticipant?.avatarUrl} />
          <Typography.Title level={5}>
            <NameWithCountryFlag
              country={chatParticipant?.country || ''}
              name={chatParticipant?.displayName || ''}
            />
          </Typography.Title>
          <Typography.Text type='secondary'>{`Joined in ${chatParticipant?.created.toLocaleDateString()}`}</Typography.Text>
        </div>
      ) : null}

      {gettingPageError ? (
        <Typography.Title type='danger' level={3} className={styles.chatBoxMessageError}>
          {gettingPageError}
        </Typography.Title>
      ) : null}
    </InfiniteScroll>
  );
};

export default ChatMessageList;
