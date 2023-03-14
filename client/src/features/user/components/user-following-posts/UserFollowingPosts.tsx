import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import {
  addNewFollowingPosts,
  getFollowingPosts,
} from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserFollowingPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return getFollowingPosts(userSpecificPostsFetchingRequest);
  };

  const addPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return addNewFollowingPosts(userSpecificPostsFetchingRequest);
  };

  return <PostList fetchPosts={fetchPosts} addPosts={addPosts} />;
};

export default UserFollowingPosts;
