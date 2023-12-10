import { Avatar, List, Skeleton } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../Store';
import {
  appendConversationsPageDispatcher,
  createNewConversation,
  getConversationsPageDispatcher,
} from '../../Store/chat/chat-dispatchers';
import {
  addConversationPage,
  setConversationIsGettingPage,
  setConversationIsLoading,
  setConversationLoadingError,
  setConversations,
} from '../../Store/chat/chat-slice';
import useRemoveErrorWhenUnmount from '../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../custom-hooks/render-error-message';
import { Constant } from '../../models/enums/constant';
import PageOptions from '../../models/page-options';
import { getAllConversations } from '../../services/chat-service';
import UserSummaryListSkeleton from '../user-summary-list-skeleton/UserSummaryListSkeleton';
import styles from './ChatConversations.module.css';

const actionCreator = {
  setIsLoading: setConversationIsLoading,
  setIsGettingPage: setConversationIsGettingPage,
  setPage: setConversations,
  addPage: addConversationPage,
};

const ConversationsList = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.profile!);
  const conversationState = useAppSelector((state) => state.chat.conversationState);
  const { isGettingConversations, isLoading, error, conversations, pagination } =
    conversationState;

  useRemoveErrorWhenUnmount(setConversationLoadingError);
  useRenderErrorMessage(error, setConversationLoadingError);

  const getNextPage = () => {
    if (isGettingConversations) {
      return;
    }

    const nextPageOptions: PageOptions = {
      page: pagination.page + 1,
      size: Constant.PageSize as number,
    };
    const fetchPostRequest = {
      pageOptions: nextPageOptions,
    };

    dispatch(
      appendConversationsPageDispatcher(
        fetchPostRequest,
        getAllConversations,
        actionCreator,
      ),
    );
  };

  useEffect(() => {
    const pageOptions: PageOptions = {
      page: 0,
      size: Constant.PageSize as number,
    };
    const fetchConversationRequest = {
      pageOptions,
    };

    dispatch(
      getConversationsPageDispatcher(
        fetchConversationRequest,
        getAllConversations,
        actionCreator,
      ),
    );
  }, [dispatch]);

  if (isLoading) {
    return <UserSummaryListSkeleton />;
  }

  return (
    <InfiniteScroll
      hasMore={!pagination.isLast}
      next={getNextPage}
      dataLength={conversations.length}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      height={window.innerHeight * 0.7}
    >
      <List
        id={Constant.ChatConversationScrollAreaId as string}
        dataSource={conversations}
        itemLayout='horizontal'
        bordered={false}
        renderItem={(conversation) => {
          const { displayName, avatarUrl, username, id } =
            conversation.getOtherParticipant(currentUser);

          return (
            <List.Item
              role='button'
              className={styles.chatConversation}
              key={conversation.id}
              onClick={() => dispatch(createNewConversation(id))}
            >
              <List.Item.Meta
                avatar={<Avatar src={avatarUrl} />}
                title={<span>{displayName}</span>}
                description={username}
              />
            </List.Item>
          );
        }}
      />
    </InfiniteScroll>
  );
};

export default ConversationsList;
