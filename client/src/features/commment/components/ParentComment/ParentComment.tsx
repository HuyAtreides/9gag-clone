import { List, Select, Skeleton } from 'antd';
import React, { useContext, useEffect, useReducer, useState } from 'react';
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
import {
  appendSingleComment,
  errorMessageActionCreator,
  getNextParentComment,
  getParentComment,
  uploadComment,
} from '../../../../Store/comment/comment-dispatchers';
import {
  CommentActionType,
  commentReducer,
  getCommentInitialState,
} from '../../../../Store/comment/comment-slice';
import { PostContext } from '../../../Home/Components/post-with-comment/PostWithComment';
import { CommentContext } from '../../context/comment-context';
import PostComment from '../PostComment/PostComment';
import styles from './ParentComment.module.css';

interface Props {
  readonly user: User;
}

const ParentComment: React.FC<Props> = ({ user }: Props) => {
  const [state, dispatch] = useReducer(commentReducer, getCommentInitialState());
  const postId = useContext(PostContext);
  const [sortType, setSortType] = useState(SortType.TOP);
  const { pagination } = state;
  const hasMoreComments = !pagination || !pagination.isLast;
  const [searchParams] = useSearchParams();
  const { commentId, parentId } = CommentQueryParamMapper.fromDto(searchParams);

  const handleUploadNewComment = async (values: CommentUploadFormData) => {
    await uploadComment(values, postId)(state, dispatch);
  };

  useRenderErrorMessage(state.errorMessage, errorMessageActionCreator, dispatch);

  const handleGetNextComments = () => {
    if (state.isGettingNextPage || state.isLoading) {
      return;
    }

    const nextPage = pagination ? pagination.page + 1 : 0;
    const size = pagination ? pagination.size : Constant.PageSize;
    const pageOptions = {
      page: nextPage,
      size: size,
      sortType,
    };
    getNextParentComment(postId, pageOptions)(state, dispatch);
  };

  useEffect(() => {
    (async () => {
      if (commentId) {
        const id = parentId ? parentId : commentId;
        await appendSingleComment(id)(state, dispatch);
      }
      getParentComment(postId, {
        page: 0,
        size: Constant.PageSize as number,
        sortType,
      })(state, dispatch);
    })();

    return () => dispatch({ type: CommentActionType.RESET_STATE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, dispatch, sortType, searchParams]);

  useEffect(() => {
    document.getElementById(Constant.CommentScrollAreaId)?.scrollIntoView();
  }, []);

  if (state.isLoading) {
    return (
      <div id={Constant.CommentScrollAreaId as string}>
        {Array.from(Array(5)).map((value, index) => (
          <>
            <Skeleton avatar paragraph={{ rows: 4 }} active />
            <br />
          </>
        ))}
      </div>
    );
  }

  return (
    <CommentContext.Provider
      value={{ user: user, state: state, dispatch, sortType: sortType }}
    >
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
        dataLength={state.comments.length}
        next={handleGetNextComments}
        hasMore={hasMoreComments}
        loader={<CenterSpinner />}
      >
        <List
          id={Constant.CommentScrollAreaId as string}
          dataSource={state.comments}
          renderItem={(comment, index) => {
            const isHighlightComment = [parentId, commentId].includes(comment.id);

            return (
              <div className={isHighlightComment ? styles['highlight-comment'] : ''}>
                <PostComment comment={comment} key={comment.id} />
              </div>
            );
          }}
          itemLayout='vertical'
        />
      </InfiniteScroll>
    </CommentContext.Provider>
  );
};

export default ParentComment;
