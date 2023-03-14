import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import { addNewUserPosts, getUserPosts } from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return getUserPosts(userSpecificPostsFetchingRequest);
  };

  const addPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return addNewUserPosts(userSpecificPostsFetchingRequest);
  };

  return <PostList fetchPosts={fetchPosts} addPosts={addPosts} />;
};

export default UserPosts;
