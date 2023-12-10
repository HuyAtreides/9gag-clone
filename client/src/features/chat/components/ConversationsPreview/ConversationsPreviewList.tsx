import { Avatar, List, Skeleton, Typography } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import useTimeDiffFromToday from '../../../../custom-hooks/use-time-diff-from-today';
import styles from './ConversationPreview.module.css';
import {
  addPreviewConversationPage,
  setPreviewConversationError,
  setPreviewConversationGettingPage,
  setPreviewConversationLoading,
  setPreviewConversations,
} from '../../../../Store/chat/chat-slice';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import useRemoveErrorWhenUnmount from '../../../../custom-hooks/remove-error';
import UserSummaryListSkeleton from '../../../../components/user-summary-list-skeleton/UserSummaryListSkeleton';
import { Constant } from '../../../../models/enums/constant';
import {
  appendConversationsPageDispatcher,
  getConversationsPageDispatcher,
} from '../../../../Store/chat/chat-dispatchers';
import { getNonEmptyConversations } from '../../../../services/chat-service';
import PageOptions from '../../../../models/page-options';

const actionCreator = {
  setIsLoading: setPreviewConversationLoading,
  setIsGettingPage: setPreviewConversationGettingPage,
  setPage: setPreviewConversations,
  addPage: addPreviewConversationPage,
};

interface Props {
  readonly searchTerm: string | null;
}

const ConversationPreviewList = ({ searchTerm }: Props) => {
  const dispatch = useAppDispatch();
  const commentDateDiff = useTimeDiffFromToday(new Date());
  const { isGettingPage, isLoading, pagination, conversations, error } = useAppSelector(
    (state) => state.chat.conversationState.previewConversations,
  );
  const currentUser = useAppSelector((state) => state.user.profile!);

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
      height={window.innerHeight * 0.45}
    >
      <List
        dataSource={[...conversations]}
        itemLayout='horizontal'
        renderItem={(conversation) => {
          const otherParticipant = conversation.getOtherParticipant(currentUser);

          return (
            <List.Item
              role='button'
              className={styles.conversationPreview}
              extra={<span className={styles.unreadMark}></span>}
            >
              <List.Item.Meta
                avatar={<Avatar src={otherParticipant.avatarUrl} />}
                title={
                  <Link to={`/user/${otherParticipant.id}`}>
                    {otherParticipant.displayName}
                  </Link>
                }
                description={
                  <span className={styles.latestMessagePreview}>
                    <Typography.Paragraph
                      className={styles.messageContentPreview}
                      ellipsis={{
                        expandable: false,
                        rows: 1,
                        suffix: '',
                      }}
                    >
                      You: Ant Design, a design language for background applications, is
                      refined by Ant UED Team Ant Design, a design language for background
                      applications, is refined by Ant UED Team Ant Design, a design
                      language for background applications, is refined by Ant UED Team Ant
                      Design, a design language for background applications, is refined by
                      Ant UED Team Ant Design, a design language for background
                      applications, is refined by Ant UED Team Ant Design, a design
                      language for background applications, is refined by Ant UED Team Ant
                      Design, a design language for background applications, is refined by
                      Ant UED Team Ant Design, a design language for background
                      applications, is refined by Ant UED Team
                    </Typography.Paragraph>
                    <Typography.Paragraph className={styles.messageContentDate}>
                      &#8226; {commentDateDiff}
                    </Typography.Paragraph>
                  </span>
                }
              />
            </List.Item>
          );
        }}
      />
    </InfiniteScroll>
  );
};

export default ConversationPreviewList;
