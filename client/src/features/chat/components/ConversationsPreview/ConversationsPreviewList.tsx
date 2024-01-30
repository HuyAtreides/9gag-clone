import { List, Skeleton } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  appendConversationsPageDispatcher,
  getConversationsPageDispatcher,
} from '../../../../Store/chat/chat-dispatchers';
import {
  addPreviewConversationPage,
  setPreviewConversationError,
  setPreviewConversationGettingPage,
  setPreviewConversationLoading,
  setPreviewConversations,
} from '../../../../Store/chat/chat-slice';
import UserSummaryListSkeleton from '../../../../components/user-summary-list-skeleton/UserSummaryListSkeleton';
import useRemoveErrorWhenUnmount from '../../../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import PageOptions from '../../../../models/page-options';
import { getNonEmptyConversations } from '../../../../services/chat-service';
import ConversationPreview from './ConversationPreview';

const actionCreator = {
  setIsLoading: setPreviewConversationLoading,
  setIsGettingPage: setPreviewConversationGettingPage,
  setPage: setPreviewConversations,
  addPage: addPreviewConversationPage,
};

interface Props {
  readonly searchTerm: string | null;
  readonly standAlone?: boolean;
}

const ConversationPreviewList = ({ searchTerm, standAlone = false }: Props) => {
  const dispatch = useAppDispatch();
  const { isGettingPage, isLoading, pagination, conversations, error } = useAppSelector(
    (state) => state.chat.conversationState.previewConversations,
  );
  useRenderErrorMessage(error, setPreviewConversationError);
  useRemoveErrorWhenUnmount(setPreviewConversationError);

  const getNextPage = () => {
    if (isGettingPage) {
      return;
    }

    const nextPageOptions: PageOptions = {
      page: pagination.page + 1,
      size: Constant.PageSize as number,
      search: searchTerm || undefined,
    };
    const fetchPostRequest = {
      pageOptions: nextPageOptions,
    };

    dispatch(
      appendConversationsPageDispatcher(
        fetchPostRequest,
        getNonEmptyConversations,
        actionCreator,
      ),
    );
  };

  useEffect(() => {
    const pageOptions: PageOptions = {
      page: 0,
      size: Constant.PageSize as number,
      search: searchTerm || undefined,
    };
    const fetchConversationRequest = {
      pageOptions,
    };

    dispatch(
      getConversationsPageDispatcher(
        fetchConversationRequest,
        getNonEmptyConversations,
        actionCreator,
      ),
    );
  }, [dispatch, searchTerm]);

  if (isLoading) {
    return <UserSummaryListSkeleton />;
  }

  return (
    <InfiniteScroll
      hasMore={!pagination.isLast}
      next={getNextPage}
      dataLength={conversations.length}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      height={window.innerHeight * 0.65}
    >
      <List
        dataSource={[...conversations]}
        itemLayout='horizontal'
        renderItem={(conversation) => (
          <ConversationPreview conversation={conversation} standAlone={standAlone} />
        )}
      />
    </InfiniteScroll>
  );
};

export default ConversationPreviewList;
