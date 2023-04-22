import { Empty, List } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { getPost } from '../../../../Store/post/post-dispatchers';
import { resetState, setPostErrorMessage } from '../../../../Store/post/post-slice';
import CommentList from '../../../commment/components/CommentList/CommentList';
import PostContent from '../Post/PostContent';
import PostSkeleton from '../PostSkeleton/PostSkeleton';

export const PostContext = React.createContext(-1);

const PostWithComment: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.post.isLoading);
  const errorMessage = useAppSelector((state) => state.post.errorMessage);
  const { id } = useParams();
  const postId = Number(id);
  const isValidId = id && !isNaN(postId);
  const post = useAppSelector((state) =>
    state.post.posts.find((post) => post.id === postId),
  );

  useRenderErrorMessage(errorMessage, setPostErrorMessage);
  useEffect(() => {
    if (isValidId) {
      dispatch(getPost(postId));
    }

    return () => {
      dispatch(resetState());
    };
  }, [postId, dispatch, isValidId]);

  if (!isValidId) {
    return <Navigate to='/' />;
  }

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (!post) {
    return <Empty />;
  }

  return (
    <List
      dataSource={[post]}
      renderItem={(post, index) => (
        <>
          <PostContent post={post} key={post.id} />
          <PostContext.Provider value={postId}>
            <CommentList />
          </PostContext.Provider>
        </>
      )}
      itemLayout='vertical'
    />
  );
};

export default PostWithComment;
