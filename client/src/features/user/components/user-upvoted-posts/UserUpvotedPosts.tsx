import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import {
  addNewUpvotedPosts,
  getUpvotedPosts,
} from '../../../../Store/post/post-dispatchers';
import PostList from '../../../Home/pages/post-list/PostList';

const UserUpvotedPosts: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return getUpvotedPosts(userSpecificPostsFetchingRequest);
  };

  const addPosts = (postFetchingRequest: PostsFetchingRequest) => {
    const userSpecificPostsFetchingRequest = {
      ...postFetchingRequest,
      userId,
    };

    return addNewUpvotedPosts(userSpecificPostsFetchingRequest);
  };

  return <PostList fetchPosts={fetchPosts} addPosts={addPosts} />;
};

export default UserUpvotedPosts;
