import { List, Select, Skeleton } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import CommentEditor from '../../../../components/comment-editor/CommentEditor';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import { SortType } from '../../../../models/enums/sort-type';
import { CommentUploadFormData } from '../../../../models/upload-comment-form-data';
import { User } from '../../../../models/user';
import { CommentQueryParamMapper } from '../../../../services/mappers/comment-query-param-mapper';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  appendParentComments,
  appendSingleComment,
  getParentComments,
  uploadComment,
} from '../../../../Store/comment/comment-dispatchers';
import { resetState, setErrorMessage } from '../../../../Store/comment/comment-slice';
import { PostContext } from '../../../Home/Components/post-with-comment/PostWithComment';
import PostComment from '../PostComment/PostComment';
import styles from './ParentComment.module.css';

interface Props {
  readonly user: User;
}

export const CommentSortTypeContext = React.createContext(SortType.FRESH);

const ParentComment: React.FC<Props> = ({ user }: Props) => {
  const dispatch = useAppDispatch();
  const commentRecord = useAppSelector((state) => state.comment);
  const commentState = useAppSelector((state) => state.comment[0]);
  const postId = useContext(PostContext);
  const [sortType, setSortType] = useState(SortType.TOP);
  const { pagination } = commentState;
  const hasMoreComments = !pagination || !pagination.isLast;
  const [searchParams] = useSearchParams();
  const { commentId, parentId } = CommentQueryParamMapper.fromDto(searchParams);

  const handleUploadNewComment = async (values: CommentUploadFormData) => {
    await dispatch(uploadComment(values, postId));
  };

  useRenderErrorMessage(commentState.errorMessage, setErrorMessage, dispatch);

  const handleGetNextComments = () => {
    if (commentState.isGettingNextPage || commentState.isLoading) {
      return;
    }

    const nextPage = pagination ? pagination.page + 1 : 0;
    const size = pagination ? pagination.size : Constant.PageSize;
    const pageOptions = {
      page: nextPage,
      size: size,
      sortType,
    };
    dispatch(
      appendParentComments({
        postId,
        pageOptions,
      }),
    );
  };

  useEffect(() => {
    (async () => {
      if (commentId) {
        const id = parentId ? parentId : commentId;
        await dispatch(appendSingleComment(id, 0));
      }
      const pageOptions = {
        page: 0,
        size: Constant.PageSize as number,
        sortType,
      };
      dispatch(
        getParentComments({
          postId,
          pageOptions,
        }),
      );
    })();

    document.getElementById(Constant.CommentScrollAreaId)?.scrollIntoView();
    return () => {
      dispatch(resetState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, dispatch, sortType, parentId, commentId]);

  if (commentState.isLoading) {
    return (
      <div id={Constant.CommentScrollAreaId as string}>
        {Array.from(Array(5)).map((_, __) => (
          <>
            <Skeleton avatar paragraph={{ rows: 4 }} active />
            <br />
          </>
        ))}
      </div>
    );
  }

  return (
    <CommentSortTypeContext.Provider value={sortType}>
      <CommentEditor handleSubmit={handleUploadNewComment} />

      <Select
        bordered={false}
        options={[
          { value: SortType.TOP, label: 'Top Comments' },
          { value: SortType.FRESH, label: 'Latest Comments' },
        ]}
        value={sortType}
        onChange={setSortType}
      />
      <InfiniteScroll
        dataLength={commentState.childrenId.length}
        next={handleGetNextComments}
        hasMore={hasMoreComments}
        loader={<CenterSpinner />}
      >
        <List
          id={Constant.CommentScrollAreaId as string}
          dataSource={commentState.childrenId}
          renderItem={(id, index) => {
            const isHighlightComment = [parentId, commentId].includes(id);
            const { comment } = commentRecord[id];

            return (
              <div className={isHighlightComment ? styles['highlight-comment'] : ''}>
                <PostComment comment={comment!} key={id} />
              </div>
            );
          }}
          itemLayout='vertical'
        />
      </InfiniteScroll>
    </CommentSortTypeContext.Provider>
  );
};

export default ParentComment;
