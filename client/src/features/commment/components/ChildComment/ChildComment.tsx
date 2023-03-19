import { Button } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import AppComment from '../../../../models/comment';
import { Constant } from '../../../../models/enums/constant';
import { CommentQueryParamMapper } from '../../../../services/mappers/comment-query-param-mapper';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  appendSingleComment,
  getChildrenComment,
} from '../../../../Store/comment/comment-dispatchers';
import { CommentSortTypeContext } from '../ParentComment/ParentComment';

import PostComment from '../PostComment/PostComment';

interface Props {
  readonly parent: AppComment;
}

const ChildComment: React.FC<Props> = ({ parent }: Props) => {
  const dispatch = useAppDispatch();
  const sortType = useContext(CommentSortTypeContext);
  const commentState = useAppSelector((state) => state.comment[parent.id]);
  const commentRecord = useAppSelector((state) => state.comment);
  const { pagination } = commentState;
  const currentChildren = (pagination?.size || 0) * ((pagination?.page || 0) + 1);
  const totalChildrenLeft = parent.totalChildren - currentChildren;
  const hasMoreReplies = totalChildrenLeft > 0 || (pagination && !pagination.isLast);
  const [searchParams] = useSearchParams();
  const { commentId, parentId, replyToId } =
    CommentQueryParamMapper.fromDto(searchParams);

  const getComments = () => {
    const pageOptions = {
      page: pagination ? pagination.page + 1 : 0,
      size: pagination ? pagination.size : Constant.PageSize,
      sortType,
    };
    dispatch(
      getChildrenComment({
        pageOptions,
        parentId: parent.id,
      }),
    );
  };

  useEffect(() => {
    if (parentId !== parent.id) {
      return;
    }

    (async () => {
      if (replyToId && replyToId !== parentId) {
        await dispatch(appendSingleComment(replyToId, parent.id));
      }

      if (commentId) {
        dispatch(appendSingleComment(commentId, parent.id));
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      {commentState.childrenId.map((id, _) => (
        <PostComment comment={commentRecord[id].comment!} key={id} />
      ))}

      {commentState.isLoading ? <CenterSpinner /> : null}

      {hasMoreReplies ? (
        <Button
          type='text'
          onClick={getComments}
        >{`View ${totalChildrenLeft} replies`}</Button>
      ) : null}
    </>
  );
};

export default ChildComment;
