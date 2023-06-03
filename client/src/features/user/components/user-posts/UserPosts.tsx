import { useCallback } from 'react';
import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import { addNewUserPosts, getUserPosts } from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return getUserPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );

  const addPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return addNewUserPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );

  return (
    <PostList fetchPosts={fetchPosts} addPosts={addPosts} shouldScrollToTop={false} />
  );
};

export default UserPosts;
