import { MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Modal, Skeleton } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  appendSearchMessages,
  fetchSearchMessages,
} from '../../../../Store/chat/chat-dispatchers';
import {
  resetSearchMessagesState,
  setSearchMessagesError,
} from '../../../../Store/chat/chat-slice';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import UserSummaryListSkeleton from '../../../../components/user-summary-list-skeleton/UserSummaryListSkeleton';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import ChatMessageContent from '../ChatBox/ChatMessageContent';
import styles from './SearchChatMessage.module.css';

interface Props {
  readonly visible: boolean;
  readonly conversationId: number;
  readonly close: () => void;
  readonly viewMessage: (id: number) => void;
}

const SearchChatMessage = ({ viewMessage, close, conversationId, visible }: Props) => {
  const dispatch = useAppDispatch();
  const { messages, pagination, isGettingPage, isLoading, error } = useAppSelector(
    (state) => state.chat.searchChatMessageState,
  );
  const [searchTerm, setSearchTerm] = useState<string | undefined>('');

  useRenderErrorMessage(error, setSearchMessagesError);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value.trim();
      setSearchTerm(searchTerm.length === 0 ? undefined : searchTerm);
    }, Constant.DebounceTimeInMiliSeconds),
    [],
  );

  useEffect(() => {
    if (visible && searchTerm) {
      dispatch(
        fetchSearchMessages({
          conversationId,
          pageOptions: {
            page: 0,
            size: Constant.PageSize as number,
            search: searchTerm,
          },
        }),
      );
    }

    return () => {
      dispatch(resetSearchMessagesState());
    };
  }, [dispatch, conversationId, visible, searchTerm]);

  const getNextPage = () => {
    if (isGettingPage) {
      return;
    }

    dispatch(
      appendSearchMessages({
        conversationId,
        pageOptions: {
          page: pagination.page + 1,
          size: Constant.PageSize as number,
          search: searchTerm,
        },
      }),
    );
  };
  return (
    <Modal
      title='Search messages'
      visible={visible}
      onCancel={close}
      centered
      className={styles.dialog}
    >
      <Input
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        placeholder='Search'
        allowClear
      />
      <br />
      <br />
      {isLoading ? (
        <UserSummaryListSkeleton />
      ) : (
        <InfiniteScroll
          dataLength={messages.length}
          next={getNextPage}
          hasMore={false}
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
                            viewMessage(message.id);
                            close();
                          }}
                        >
                          View in chat
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

export default SearchChatMessage;
