import { useCallback } from 'react';
import {
  appendFollowers,
  getFollowers,
} from '../../../../Store/user-summary/user-summary-dispatcher';
import UserSummaryList from '../../../../components/user-summary-list/UserSummaryList';
import { FetchUserRequest } from '../../../../models/requests/fetch-user-request';
import { PageFetchingRequest } from '../../../../models/requests/page-fetching-request';
import UserFollowerSummary from './user-follower-summary/UserFollowerSummary';

const UserFollowers: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchFollowers = useCallback(
    (pageRequest: PageFetchingRequest) => {
      const fetchUserRequest: FetchUserRequest = {
        ...pageRequest,
        userId,
      };
      return getFollowers(fetchUserRequest);
    },
    [userId],
  );
  const fetchNewFollowers = useCallback(
    (pageRequest: PageFetchingRequest) => {
      const fetchUserRequest: FetchUserRequest = {
        ...pageRequest,
        userId,
      };
      return appendFollowers(fetchUserRequest);
    },
    [userId],
  );
  return (
    <UserSummaryList
      fetchUsers={fetchFollowers}
      appendUsers={fetchNewFollowers}
      UserSummary={UserFollowerSummary}
    />
  );
};

export default UserFollowers;
