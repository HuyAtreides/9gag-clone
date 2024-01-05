import { MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Modal, Skeleton } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  appendPinnedMessages,
  fetchPinnedMessages,
  unPin,
} from '../../../../Store/chat/chat-dispatchers';
import {
  resetPinnedMessagesState,
  setPinnedMessageError,
} from '../../../../Store/chat/chat-slice';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import UserSummaryListSkeleton from '../../../../components/user-summary-list-skeleton/UserSummaryListSkeleton';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import ChatMessageContent from '../ChatBox/ChatMessageContent';
import styles from './PinnedChatMessageDialog.module.css';

interface Props {
  readonly visible: boolean;
  readonly conversationId: number;
  readonly close: () => void;
  readonly viewPinnedMessage: (id: number) => void;
}

const PinnedChatMessageDialog = ({
  visible,
  conversationId,
  close,
  viewPinnedMessage,
}: Props) => {
  const dispatch = useAppDispatch();
  const { messages, pagination, isGettingPage, isLoading, error } = useAppSelector(
    (state) => state.chat.pinnedMessageState,
  );

  useRenderErrorMessage(error, setPinnedMessageError);

  const handleUnpin = (messageId: number) => {
    dispatch(unPin(conversationId, messageId));
    close();
  };

  useEffect(() => {
    if (visible) {
      dispatch(
        fetchPinnedMessages({
          conversationId,
          pageOptions: {
            page: 0,
            size: Constant.PageSize as number,
          },
        }),
      );
    }

    return () => {
      dispatch(resetPinnedMessagesState());
    };
  }, [dispatch, conversationId, visible]);

  const getNextPage = () => {
    if (isGettingPage) {
      return;
    }

    dispatch(
      appendPinnedMessages({
        conversationId,
        pageOptions: {
          page: pagination.page + 1,
          size: Constant.PageSize as number,
        },
      }),
    );
  };

  return (
    <Modal
      title='Pinned messages'
      visible={visible}
      onCancel={close}
      centered
      className={styles.dialog}
    >
      {isLoading ? (
        <UserSummaryListSkeleton />
      ) : (
        <InfiniteScroll
          dataLength={messages.length}
          next={getNextPage}
          hasMore={!error && !pagination.isLast}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          height='75vh'
        >
          <List
            dataSource={[...messages]}
            renderItem={(message, _) => (
              <List.Item
                actions={[
                  <AutoClosePopover
                    placement='left'
                    content={
                      <div className='more-action-box-container'>
                        <Button
                          block
                          type='text'
                          onClick={() => {
                            viewPinnedMessage(message.id);
                            close();
                          }}
                        >
                          View in chat
                        </Button>
                        <Button block type='text' onClick={() => handleUnpin(message.id)}>
                          Unpin
                        </Button>
                      </div>
                    }
                  >
                    <Button type='text' icon={<MoreOutlined />} />
                  </AutoClosePopover>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={message.owner.avatarUrl} size={50} />}
                  title={
                    <Link to={`/user/${message.owner.id}`}>
                      <NameWithCountryFlag
                        name={message.owner.username}
                        country={message.owner.country || undefined}
                      />
                    </Link>
                  }
                  description={
                    <div className={styles.message}>
                      <ChatMessageContent message={message} />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      )}
    </Modal>
  );
};

export default PinnedChatMessageDialog;
