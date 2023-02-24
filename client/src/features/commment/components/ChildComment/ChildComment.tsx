import { Button } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import CommentEditor from '../../../../components/comment-editor/CommentEditor';
import AppComment from '../../../../models/comment';
import { Constant } from '../../../../models/enums/constant';
import { CommentUploadFormData } from '../../../../models/upload-comment-form-data';
import { CommentQueryParamMapper } from '../../../../services/mappers/comment-query-param-mapper';
import {
  appendSingleComment,
  getChildrenComment,
  reply,
} from '../../../../Store/comment/comment-dispatchers';
import { CommentContext } from '../../context/comment-context';
import PostComment from '../PostComment/PostComment';

interface Props {
  readonly showEditor: boolean;
  readonly parent: AppComment;
  readonly handleCancel: () => void;
}

const ChildComment: React.FC<Props> = ({ showEditor, parent, handleCancel }: Props) => {
  const { state, dispatch, sortType } = useContext(CommentContext)!;
  const { pagination } = state;
  const currentChildren = (pagination?.size || 0) * ((pagination?.page || 0) + 1);
  const totalChildrenLeft = parent.totalChildren - currentChildren;
  const hasMoreReplies = totalChildrenLeft > 0 || (pagination && !pagination.isLast);
  const [searchParams] = useSearchParams();
  const { commentId, parentId, replyToId } =
    CommentQueryParamMapper.fromDto(searchParams);

  const handleReply = async (values: CommentUploadFormData) => {
    await reply(values, parent.id)(state, dispatch);
  };

  const getComments = () => {
    const pageOptions = {
      page: pagination ? pagination.page + 1 : 0,
      size: pagination ? pagination.size : Constant.PageSize,
      sortType,
    };
    getChildrenComment(parent.id, pageOptions)(state, dispatch);
  };

  useEffect(() => {
    if (parentId !== parent.id) {
      return;
    }

    (async () => {
      if (replyToId && replyToId !== parentId) {
        await appendSingleComment(replyToId)(state, dispatch);
      }

      if (commentId) {
        appendSingleComment(commentId)(state, dispatch);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      {showEditor ? (
        <CommentEditor handleSubmit={handleReply} handleCancel={handleCancel} />
      ) : null}

      {state.comments.map((comment, _) => (
        <PostComment comment={comment} key={comment.id} />
      ))}

      {state.isLoading ? <CenterSpinner /> : null}

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
