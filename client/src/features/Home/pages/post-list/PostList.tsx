import { List } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import useRemoveErrorWhenUnmount from '../../../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import PageOptions from '../../../../models/page-options';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { addNewPosts, getPosts } from '../../../../Store/post/post-dispatchers';
import { resetState, setPostErrorMessage } from '../../../../Store/post/post-slice';
import PostContent from '../../Components/Post/PostContent';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.post.isLoading);
  const posts = useAppSelector((state) => state.post.posts);
  const user = useAppSelector((state) => state.user.profile);
  const page = useAppSelector((state) => state.post.pagination?.page);
  const isLast = useAppSelector((state) => state.post.pagination?.isLast);
  const errorMessage = useAppSelector((state) => state.post.errorMessage);
  const isGettingPage = useAppSelector((state) => state.post.isGettingPage);
  const searchTerm = useAppSelector((state) => state.post.searchTerm);
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
      search: searchTerm,
    };

    dispatch(addNewPosts(nextPageOptions, tag!, section));
  };

  useEffect(() => {
    const pageOptions: PageOptions = {
      page: 0,
      size: Constant.PageSize as number,
      search: searchTerm,
    };

    dispatch(getPosts(pageOptions, tag!, section));

    return () => {
      dispatch(resetState);
    };
  }, [dispatch, tag, section, user, searchTerm]);

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
