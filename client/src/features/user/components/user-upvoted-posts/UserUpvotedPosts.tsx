import { useCallback } from 'react';
import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import {
  addNewUpvotedPosts,
  getUpvotedPosts,
} from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserUpvotedPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return getUpvotedPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );

  const addPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return addNewUpvotedPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );

  return (
    <PostList fetchPosts={fetchPosts} addPosts={addPosts} shouldScrollToTop={false} />
  );
};

export default UserUpvotedPosts;
