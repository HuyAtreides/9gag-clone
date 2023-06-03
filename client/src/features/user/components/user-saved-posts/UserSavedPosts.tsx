import { useCallback } from 'react';
import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import { addNewSavedPosts, getSavedPosts } from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserSavedPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return getSavedPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );

  const addPosts = useCallback(
    (postFetchingRequest: PostsFetchingRequest) => {
      const userSpecificPostsFetchingRequest = {
        ...postFetchingRequest,
        userId,
      };

      return addNewSavedPosts(userSpecificPostsFetchingRequest);
    },
    [userId],
  );

  return (
    <PostList fetchPosts={fetchPosts} addPosts={addPosts} shouldScrollToTop={false} />
  );
};

export default UserSavedPosts;
