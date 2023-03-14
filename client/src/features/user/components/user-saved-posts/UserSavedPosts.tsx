import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import { addNewSavedPosts, getSavedPosts } from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserSavedPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return getSavedPosts(userSpecificPostsFetchingRequest);
  };

  const addPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return addNewSavedPosts(userSpecificPostsFetchingRequest);
  };

  return <PostList fetchPosts={fetchPosts} addPosts={addPosts} />;
};

export default UserSavedPosts;
