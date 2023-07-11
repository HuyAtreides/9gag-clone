import { Card, Empty, Skeleton, Typography } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store';
import { getSharedPost } from '../../Store/post/post-dispatchers';
import Post from '../../models/post';
import SharedPostContent from './SharedPostContent';

const SharedPostContainer: React.FC<{ post: Post }> = ({ post: sharedPostContainer }) => {
  const dispatch = useAppDispatch();
  const id = sharedPostContainer.id;
  const sharedPostState = useAppSelector((state) => state.post.sharedPosts[id]);
  const { isLoading, sharedPost, hasError } = sharedPostState;

  useEffect(() => {
    if (!sharedPost && !hasError) {
      dispatch(getSharedPost(id));
    }
  }, [dispatch, id, sharedPost, hasError]);

  if (isLoading) {
    return (
      <Card loading>
        <Skeleton loading avatar active />
      </Card>
    );
  }

  if (!sharedPost) {
    return (
      <Card>
        <Empty
          description={
            <Typography.Title level={4}>
              This content isn't available right now
            </Typography.Title>
          }
        />
      </Card>
    );
  }

  return (
    <Link to={`/post/${sharedPostContainer.sharedPostId}`}>
      <SharedPostContent sharedPost={sharedPost} />
    </Link>
  );
};

export default SharedPostContainer;
