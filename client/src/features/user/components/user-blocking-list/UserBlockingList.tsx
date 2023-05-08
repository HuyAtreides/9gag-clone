import { Button, Divider, Typography } from 'antd';
import {
  appendBlocking,
  blockInSummaryList,
  getBlocking,
  unblock,
} from '../../../../Store/user-summary/user-summary-dispatcher';
import UserSummaryList from '../../../../components/user-summary-list/UserSummaryList';
import UserSummary from '../../../../components/user-summary/UserSummary';
import { PageFetchingRequest } from '../../../../models/requests/page-fetching-request';
import { User } from '../../../../models/user';
import { useAppDispatch } from '../../../../Store';
import { useState } from 'react';
import useTimeDiffFromToday from '../../../../custom-hooks/use-time-diff-from-today';

const BlockedUser: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const timeDiff = useTimeDiffFromToday(user.blockedTime!);

  const handleBlock = async () => {
    setIsLoading(true);
    if (user.blocked) {
      await dispatch(unblock(user.id));
      setIsLoading(false);
      return;
    }

    await dispatch(blockInSummaryList(user.id));
    setIsLoading(false);
  };

  return (
    <UserSummary
      user={user}
      description={
        <>
          {user.displayName} &#8226; Blocked {timeDiff}
        </>
      }
      actions={[
        <Button
          type={user.blocked ? 'text' : 'primary'}
          danger
          onClick={handleBlock}
          loading={isLoading}
        >
          {user.blocked ? 'Unblock' : 'Block'}
        </Button>,
      ]}
    />
  );
};

const UserBlockingList: React.FC = () => {
  const fetchBlocking = (request: PageFetchingRequest) => {
    return getBlocking(request);
  };

  const addBlocking = (request: PageFetchingRequest) => {
    return appendBlocking(request);
  };

  return (
    <>
      <Typography.Title level={3}>Blocking List</Typography.Title>
      <Divider />
      <UserSummaryList
        fetchUsers={fetchBlocking}
        appendUsers={addBlocking}
        UserSummary={BlockedUser}
      />
    </>
  );
};

export default UserBlockingList;
