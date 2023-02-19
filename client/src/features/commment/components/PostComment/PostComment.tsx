import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Avatar, Button, Comment, Modal, Typography } from 'antd';
import React, { useContext, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentEditor from '../../../../components/comment-editor/CommentEditor';
import OwnerGuard from '../../../../components/component-guard/OwnerGuard';
import Media from '../../../../components/media/Media';
import useDownvote from '../../../../custom-hooks/downvote';
import useUpvote from '../../../../custom-hooks/upvote';
import VoteCommentActionExecutor from '../../../../custom-hooks/vote-action-executor/vote-comment-action-executor';
import AppComment from '../../../../models/comment';
import { ComputedConstants, Constant } from '../../../../models/enums/constant';
import { CommentUploadFormData } from '../../../../models/upload-comment-form-data';
import {
  deleteAppComment,
  reply,
  update,
} from '../../../../Store/comment/comment-dispatchers';
import {
  commentReducer,
  getCommentInitialState,
} from '../../../../Store/comment/comment-slice';
import { formatNumber } from '../../../../utils/format-number';
import { CommentContext } from '../../context/comment-context';
import ChildComment from '../ChildComment/ChildComment';
import styles from './PostComment.module.scss';

interface Props {
  readonly comment: AppComment;
}

const getChildCommentInitialState = () => {
  return {
    ...getCommentInitialState(),
    isLoading: false,
  };
};

const FIFTY_PERCENT_SCREEN_HEIGHT = ComputedConstants.ScreenHeight * 0.5;

const PostComment: React.FC<Props> = ({ comment }: Props) => {
  const [childrenState, childrenDispatch] = useReducer(
    commentReducer,
    getChildCommentInitialState(),
  );

  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const { user, dispatch, state, sortType } = useContext(CommentContext)!;
  const voteCommentExecutorRef = useRef(
    new VoteCommentActionExecutor(dispatch, comment.id, state),
  );
  const handleUpvote = useUpvote(comment, voteCommentExecutorRef.current);
  const handleDownvote = useDownvote(comment, voteCommentExecutorRef.current);

  const addReply = async (values: CommentUploadFormData) => {
    await reply(values, comment.id)(state, dispatch);
  };

  const deleteComment = () => {
    Modal.confirm({
      onOk: () => deleteAppComment(comment.id)(state, dispatch),
      title: 'Do you want to delete this comment?',
    });
  };

  const children = comment.isParent ? (
    <CommentContext.Provider
      value={{ user: user, state: childrenState, dispatch: childrenDispatch, sortType }}
    >
      <ChildComment
        showEditor={showReplyEditor && comment.isParent}
        handleCancel={() => setShowReplyEditor(false)}
        parent={comment}
      />
    </CommentContext.Provider>
  ) : undefined;

  const mention = comment.replyTo ? (
    <Typography.Link
      href=''
      target='_blank'
    >{`@${comment.replyTo.username}`}</Typography.Link>
  ) : null;

  if (showCommentEditor) {
    const updateComment = async (values: CommentUploadFormData) => {
      await update(comment.id, values)(state, dispatch);
    };

    return (
      <CommentEditor
        handleCancel={() => setShowCommentEditor(false)}
        handleSubmit={updateComment}
        comment={comment}
        children={children}
      />
    );
  }

  return (
    <div>
      <Comment
        actions={[
          <Button
            icon={<CaretUpOutlined className='icon' />}
            type={comment.isUpvoted ? 'primary' : 'text'}
            className={styles.actionBtn}
            onClick={handleUpvote}
          >
            <span className={styles.commentAction}>{formatNumber(comment.upvotes)}</span>
          </Button>,
          <Button
            icon={<CaretDownOutlined className='icon' />}
            type={comment.isDownvoted ? 'primary' : 'text'}
            className={styles.actionBtn}
            onClick={handleDownvote}
          >
            <span className={styles.commentAction}>
              {formatNumber(comment.downvotes)}
            </span>
          </Button>,
          <Button
            className={`${styles.commentAction} ${styles.actionBtn}`}
            type='text'
            onClick={() => setShowReplyEditor(!showReplyEditor)}
          >
            Reply to
          </Button>,
          <OwnerGuard
            component={
              <Button
                className={`${styles.commentAction} ${styles.actionBtn}`}
                type='text'
                onClick={() => setShowCommentEditor(!showCommentEditor)}
              >
                Edit
              </Button>
            }
            owner={comment.user}
          />,
          <OwnerGuard
            component={
              <Button
                className={`${styles.commentAction} ${styles.actionBtn}`}
                type='text'
                danger
                onClick={deleteComment}
              >
                Delete
              </Button>
            }
            owner={comment.user}
          />,
        ]}
        author={
          <Link className={styles.postCommentAuthor} to='/'>
            {comment.user.usernameWithFlag}
          </Link>
        }
        avatar={<Avatar src={user.avatarUrl} alt='User avatar' />}
        content={
          <>
            <Typography.Paragraph className={styles.postCommentText}>
              {mention} {comment.text}
            </Typography.Paragraph>
            {comment.mediaUrl && comment.mediaType ? (
              <Media
                url={comment.mediaUrl}
                type={comment.mediaType}
                height={FIFTY_PERCENT_SCREEN_HEIGHT}
                scrollAreaId={Constant.CommentScrollAreaId as string}
              />
            ) : null}
          </>
        }
        datetime={comment.date.toLocaleDateString()}
      >
        {showReplyEditor && !comment.isParent ? (
          <CommentEditor
            handleCancel={() => setShowReplyEditor(false)}
            handleSubmit={addReply}
          />
        ) : null}

        {children}
      </Comment>
    </div>
  );
};

export default React.memo(PostComment, (prevProps, currentProps) => {
  return prevProps.comment === currentProps.comment;
});
