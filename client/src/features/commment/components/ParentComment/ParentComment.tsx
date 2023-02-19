import { List, Select } from 'antd';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import CommentEditor from '../../../../components/comment-editor/CommentEditor';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import { SortType } from '../../../../models/enums/sort-type';
import { CommentUploadFormData } from '../../../../models/upload-comment-form-data';
import { User } from '../../../../models/user';
import {
  errorMessageActionCreator,
  getNextParentComment,
  getParentComment,
  uploadComment,
} from '../../../../Store/comment/comment-dispatchers';
import {
  commentReducer,
  getCommentInitialState,
} from '../../../../Store/comment/comment-slice';
import { PostContext } from '../../../Home/Components/post-with-comment/PostWithComment';
import { CommentContext } from '../../context/comment-context';
import PostComment from '../PostComment/PostComment';

interface Props {
  readonly user: User;
}

const ParentComment: React.FC<Props> = ({ user }: Props) => {
  const [state, dispatch] = useReducer(commentReducer, getCommentInitialState());
  const postId = useContext(PostContext);
  const [sortType, setSortType] = useState(SortType.TOP);
  const { pagination } = state;

  const handleUploadNewComment = async (values: CommentUploadFormData) => {
    await uploadComment(values, postId)(state, dispatch);
  };

  useRenderErrorMessage(state.errorMessage, errorMessageActionCreator, dispatch);

  const getParentComments = () => {
    if (state.isGettingNextPage || state.isLoading || !pagination) {
      return;
    }

    const pageOptions = {
      page: pagination.page + 1,
      size: pagination.size,
      sortType,
    };
    getNextParentComment(postId, pageOptions)(state, dispatch);
  };

  useEffect(() => {
    const pageOptions = {
      page: 0,
      size: Constant.PageSize as number,
      sortType,
    };
    getParentComment(postId, pageOptions)(state, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, dispatch, sortType]);

  if (state.isLoading) {
    return <CenterSpinner />;
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
        next={getParentComments}
        hasMore={!Boolean(state.pagination?.isLast)}
        loader={<CenterSpinner />}
      >
        <List
          id={Constant.CommentScrollAreaId as string}
          dataSource={state.comments}
          renderItem={(comment, index) => (
            <PostComment comment={comment} key={comment.id} />
          )}
          itemLayout='vertical'
        />
      </InfiniteScroll>
    </CommentContext.Provider>
  );
};

export default ParentComment;
