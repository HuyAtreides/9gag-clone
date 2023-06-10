import { useCallback } from 'react';
import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import {
  addNewFollowingPosts,
  getFollowingPosts,
} from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserFollowingPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return getFollowingPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );

  const addPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return addNewFollowingPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );
  return (
    <PostList fetchPosts={fetchPosts} addPosts={addPosts} shouldScrollToTop={false} />
  );
};

export default UserFollowingPosts;
