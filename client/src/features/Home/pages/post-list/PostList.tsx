import { List, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Constant } from '../../../../models/enums/constant';
import PageOptions from '../../../../models/page-options';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { addNewPosts, getPosts } from '../../../../Store/post/post-dispatchers';
import PostContent from '../../Components/Post/PostContent';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import useRemoveErrorWhenUnmount from '../../../../custom-hooks/remove-error';
import {
  setIsGettingPage,
  setIsLoading,
  setPagination,
  setPostErrorMessage,
  setPosts,
} from '../../../../Store/post/post-slice';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.post.isLoading);
  const posts = useAppSelector((state) => state.post.posts);
  const page = useAppSelector((state) => state.post.pagination?.page);
  const isLast = useAppSelector((state) => state.post.pagination?.isLast);
  const errorMessage = useAppSelector((state) => state.post.errorMessage);
  const isGettingPage = useAppSelector((state) => state.post.isGettingPage);
  const { tag, section } = useParams();

  useRemoveErrorWhenUnmount(setPostErrorMessage);
  useRenderErrorMessage(errorMessage, setPostErrorMessage);

  const getNextPage = () => {
    if (isGettingPage) {
      return;
    }

    const nextPageOptions: PageOptions = {
      page: page! + 1,
      size: Constant.PageSize as number,
    };

    dispatch(addNewPosts(nextPageOptions, tag!, section));
  };

  useEffect(() => {
    const pageOptions: PageOptions = {
      page: 0,
      size: Constant.PageSize as number,
    };

    dispatch(getPosts(pageOptions, tag!, section));

    return () => {
      dispatch(setIsGettingPage(false));
      dispatch(setIsLoading(false));
      dispatch(setPagination(null));
      dispatch(setPosts(null));
    };
  }, [dispatch, tag, section]);

  if (isLoading) {
    return (
      <>
        {Array.from(Array(5)).map((value, index) => (
          <PostSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <InfiniteScroll
      dataLength={posts!.length}
      next={getNextPage}
      hasMore={!isLast}
      loader={<PostSkeleton />}
    >
      <List
        dataSource={posts!}
        renderItem={(post, index) => (
          <PostContent post={post} key={post.id} index={index} />
        )}
        itemLayout='vertical'
      />
    </InfiniteScroll>
  );
};

export default PostList;
