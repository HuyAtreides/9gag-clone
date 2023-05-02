import { List } from 'antd';
import { useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import useRemoveErrorWhenUnmount from '../../../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import { SortType } from '../../../../models/enums/sort-type';
import PageOptions from '../../../../models/page-options';
import { PostsFetchingRequest } from '../../../../models/requests/posts-fetching-request';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addNewPosts,
  FetchPostsThunkAction,
  getPosts,
} from '../../../../Store/post/post-dispatchers';
import {
  resetState,
  setPostErrorMessage,
  setSearchTerm,
} from '../../../../Store/post/post-slice';
import { toEnum } from '../../../../utils/value-to-enum';
import PostContent from '../../Components/Post/PostContent';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import { InfiniteScrollHeight } from '../../../../context/infinite-scroll-height';

interface Props {
  readonly fetchPosts?: FetchPostsThunkAction<PostsFetchingRequest>;
  readonly addPosts?: FetchPostsThunkAction<PostsFetchingRequest>;
}

const defaultFetchPostsThunkAction = (postFetchRequest: PostsFetchingRequest) => {
  return getPosts(postFetchRequest);
};

const defaultAddPostsThunkAction = (postFetchRequest: PostsFetchingRequest) => {
  return addNewPosts(postFetchRequest);
};

const PostList: React.FC<Props> = ({
  fetchPosts = defaultFetchPostsThunkAction,
  addPosts = defaultAddPostsThunkAction,
}) => {
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
  const infiniteScrollHeight = useContext(InfiniteScrollHeight);
  const sortType = tag === undefined ? tag : toEnum(tag!, SortType);

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
      sortType,
    };
    const fetchPostRequest = {
      pageOptions: nextPageOptions,
      section,
    };

    dispatch(addPosts(fetchPostRequest));
  };

  useEffect(() => {
    const pageOptions: PageOptions = {
      page: 0,
      size: Constant.PageSize as number,
      search: searchTerm,
      sortType,
    };
    const fetchPostRequest = {
      pageOptions,
      section,
    };

    dispatch(fetchPosts(fetchPostRequest));
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tag, section, user, searchTerm, fetchPosts]);

  useEffect(() => {
    dispatch(setSearchTerm(''));
  }, [dispatch, tag, section, user]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

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
      hasMore={isLast !== undefined && !isLast}
      loader={<PostSkeleton />}
      height={infiniteScrollHeight}
    >
      <List
        id={Constant.PostScrollAreaId as string}
        dataSource={posts!}
        renderItem={(post, index) => <PostContent post={post} key={post.id} />}
        itemLayout='vertical'
      />
    </InfiniteScroll>
  );
};

export default PostList;
