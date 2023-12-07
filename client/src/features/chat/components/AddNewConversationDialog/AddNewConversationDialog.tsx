import { Button, Input, Modal } from 'antd';
import { useCallback } from 'react';
import {
  appendSearchResult,
  search,
} from '../../../../Store/user-summary/user-summary-dispatcher';
import UserSummaryList from '../../../../components/user-summary-list/UserSummaryList';
import UserSummary from '../../../../components/user-summary/UserSummary';
import useDebounceSearch from '../../../../custom-hooks/use-debounce-search';
import { PageFetchingRequest } from '../../../../models/requests/page-fetching-request';
import { User } from '../../../../models/user';
import { InfiniteScrollHeight } from '../../../../context/infinite-scroll-height';

interface Props {
  readonly open: boolean;
  readonly close: () => void;
  readonly createConversation: (userId: number) => void;
}

const AddNewConversationDialog = ({ open, close, createConversation }: Props) => {
  const [searchTerm, handleSearch] = useDebounceSearch();
  const MessageReceiver: React.FC<{ user: User }> = ({ user }) => {
    const handleClick = () => {
      createConversation(user.id);
    };

    return (
      <UserSummary
        user={user}
        actions={[
          <Button type='primary' onClick={handleClick}>
            Chat
          </Button>,
        ]}
      />
    );
  };

  const searchUser = useCallback(
    (pageRequest: PageFetchingRequest) => {
      return search({
        pageOptions: {
          ...pageRequest.pageOptions,
          search: searchTerm || undefined,
        },
      });
    },
    [searchTerm],
  );

  const appendSearchUser = useCallback(
    (pageRequest: PageFetchingRequest) => {
      return appendSearchResult({
        pageOptions: {
          ...pageRequest.pageOptions,
          search: searchTerm || undefined,
        },
      });
    },
    [searchTerm],
  );

  return (
    <Modal title='New Message' visible={open} onCancel={close} footer={null}>
      <Input.Search placeholder='Search...' onChange={handleSearch} />
      <br />
      <br />
      <InfiniteScrollHeight.Provider value={'45vh'}>
        <UserSummaryList
          fetchUsers={searchUser}
          appendUsers={appendSearchUser}
          UserSummary={MessageReceiver}
        />
      </InfiniteScrollHeight.Provider>
    </Modal>
  );
};

export default AddNewConversationDialog;
