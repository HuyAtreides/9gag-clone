import { useCallback } from 'react';
import {
  appendFollowing,
  getFollowing,
} from '../../../../Store/user-summary/user-summary-dispatcher';
import UserSummaryList from '../../../../components/user-summary-list/UserSummaryList';
import { FetchUserRequest } from '../../../../models/requests/fetch-user-request';
import { PageFetchingRequest } from '../../../../models/requests/page-fetching-request';
import UserFollowingSummary from './user-following-summary/UserFollowingSummary';

const UserFollowing: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchFollowers = useCallback(
    (pageRequest: PageFetchingRequest) => {
      const fetchUserRequest: FetchUserRequest = {
        ...pageRequest,
        userId,
      };
      return getFollowing(fetchUserRequest);
    },
    [userId],
  );
  const fetchNewFollowers = useCallback(
    (pageRequest: PageFetchingRequest) => {
      const fetchUserRequest: FetchUserRequest = {
        ...pageRequest,
        userId,
      };
      return appendFollowing(fetchUserRequest);
    },
    [userId],
  );
  return (
    <UserSummaryList
      fetchUsers={fetchFollowers}
      appendUsers={fetchNewFollowers}
      UserSummary={UserFollowingSummary}
    />
  );
};

export default UserFollowing;
