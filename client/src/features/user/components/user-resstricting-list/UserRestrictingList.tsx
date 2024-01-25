import { Button, Divider, Typography } from 'antd';
import { useState } from 'react';
import { useAppDispatch } from '../../../../Store';
import {
  appendRestricting,
  getRestricting,
  restrictInSummaryList,
  unRestrictInSummaryList,
} from '../../../../Store/user-summary/user-summary-dispatcher';
import UserSummaryList from '../../../../components/user-summary-list/UserSummaryList';
import UserSummary from '../../../../components/user-summary/UserSummary';
import useTimeDiffFromToday from '../../../../custom-hooks/use-time-diff-from-today';
import { PageFetchingRequest } from '../../../../models/requests/page-fetching-request';
import { User } from '../../../../models/user';
import ViewChatButton from '../view-chat-button/ViewChatButton';

const RestrictedUser: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const timeDiff = useTimeDiffFromToday(user.restrictedAt!);

  const handleRestrict = async () => {
    setIsLoading(true);
    if (user.restricted) {
      await dispatch(unRestrictInSummaryList(user.id));
      setIsLoading(false);
      return;
    }

    await dispatch(restrictInSummaryList(user.id));
    setIsLoading(false);
  };

  return (
    <UserSummary
      user={user}
      description={
        <>
          {user.displayName} &#8226; Restricted {timeDiff}
        </>
      }
      actions={[
        <Button type='primary' danger onClick={handleRestrict} loading={isLoading}>
          {user.restricted ? 'Unrestrict' : 'Restrict'}
        </Button>,
        <ViewChatButton user={user} />,
      ]}
    />
  );
};

const UserRestrictingList: React.FC = () => {
  const fetchRestricted = (request: PageFetchingRequest) => {
    return getRestricting(request);
  };

  const addRestricted = (request: PageFetchingRequest) => {
    return appendRestricting(request);
  };

  return (
    <>
      <Typography.Title level={3}>Restricting List</Typography.Title>
      <Divider />
      <UserSummaryList
        fetchUsers={fetchRestricted}
        appendUsers={addRestricted}
        UserSummary={RestrictedUser}
      />
    </>
  );
};

export default UserRestrictingList;
