import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Comment, Modal, Popover, Typography } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentEditor from '../../../../components/comment-editor/CommentEditor';
import OwnerGuard from '../../../../components/component-guard/OwnerGuard';
import FollowButton from '../../../../components/follow-button/FollowButton';
import Media from '../../../../components/media/Media';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import ToggleNotificationButton from '../../../../components/toggle-notification-button/ToggleNotificationButton';
import useDownvote from '../../../../custom-hooks/downvote';
import useFollow from '../../../../custom-hooks/follow';
import useToggleNotification from '../../../../custom-hooks/toggle-notification';
import useUpvote from '../../../../custom-hooks/upvote';
import VoteCommentActionExecutor from '../../../../custom-hooks/vote-action-executor/vote-comment-action-executor';
import AppComment from '../../../../models/comment';
import { Constant } from '../../../../models/enums/constant';
import { CommentUploadFormData } from '../../../../models/upload-comment-form-data';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  deleteAppComment,
  follow,
  reply,
  turnOffNotification,
  turnOnNotification,
  unFollow,
  update,
} from '../../../../Store/comment/comment-dispatchers';
import {} from '../../../../Store/comment/comment-slice';
import { formatNumber } from '../../../../utils/format-number';
import ChildComment from '../ChildComment/ChildComment';
import styles from './PostComment.module.scss';
import { PostContext } from '../../../Home/Components/post-with-comment/PostWithComment';

interface Props {
  readonly comment: AppComment;
}

const FIFTY_PERCENT_SCREEN_HEIGHT = window.innerHeight * 0.5;

const PostComment: React.FC<Props> = ({ comment }: Props) => {
  const dispatch = useAppDispatch();
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const postId = useContext(PostContext);
  const post = useAppSelector((state) =>
    state.post.posts.find((post) => {
      return post.id === postId;
    }),
  )!;
  const voteCommentExecutorRef = useRef(
    new VoteCommentActionExecutor(dispatch, comment.id),
  );
  const followComment = useFollow({
    isFollowed: comment.followed,
    followThunkAction: follow(comment.id),
    unFollowThunkAction: unFollow(comment.id),
  });
  const toggleSendNotifications = useToggleNotification({
    notificationEnabled: comment.notificationEnabled,
    turnOnNotificationThunkAction: turnOnNotification(comment.id),
    turnOffNotificationThunkAction: turnOffNotification(comment.id),
  });
  const handleUpvote = useUpvote(comment, voteCommentExecutorRef.current);
  const handleDownvote = useDownvote(comment, voteCommentExecutorRef.current);

  const addReply = async (values: CommentUploadFormData) => {
    await dispatch(reply(values, comment.id));
  };

  const deleteComment = () => {
    Modal.confirm({
      onOk: () => {
        dispatch(deleteAppComment(comment.id));
        return false;
      },
      title: 'Do you want to delete this comment?',
    });
  };

  const children = comment.isParent ? <ChildComment parent={comment} /> : undefined;

  const mention = comment.replyTo ? (
    <Typography.Link
      href={`/user/${comment.replyTo.id}`}
      target='_blank'
    >{`@${comment.replyTo.username}`}</Typography.Link>
  ) : null;

  const commentDeleteButton = post ? (
    <OwnerGuard
      component={
        <Button
          className={`${styles.commentAction} ${styles.actionBtn}`}
          block
          type='text'
          icon={<DeleteOutlined />}
          danger
          onClick={deleteComment}
        >
          Delete
        </Button>
      }
      replace={
        <OwnerGuard
          component={
            <Button
              className={`${styles.commentAction} ${styles.actionBtn}`}
              block
              type='text'
              icon={<DeleteOutlined />}
              danger
              onClick={deleteComment}
            >
              Delete
            </Button>
          }
          owner={post.user}
        />
      }
      owner={comment.user}
    />
  ) : null;

  if (showCommentEditor) {
    const updateComment = async (values: CommentUploadFormData) => {
      await dispatch(update(comment.id, values));
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
    <div className={styles['comment-container']}>
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
          <Popover
            placement='bottom'
            trigger='click'
            content={
              <div className='more-action-box-container'>
                <OwnerGuard
                  component={
                    <Button
                      className={`${styles.commentAction} ${styles.actionBtn} `}
                      block
                      type='text'
                      icon={<EditOutlined />}
                      onClick={() => setShowCommentEditor(!showCommentEditor)}
                    >
                      Edit
                    </Button>
                  }
                  owner={comment.user}
                />
                <OwnerGuard
                  owner={comment.user}
                  component={
                    <ToggleNotificationButton
                      notificationEnabled={comment.notificationEnabled}
                      handleToggle={toggleSendNotifications}
                    />
                  }
                  replace={
                    <FollowButton
                      followed={comment.followed}
                      handleFollow={followComment}
                    />
                  }
                />
                {commentDeleteButton}
              </div>
            }
          >
            <Button icon={<MoreOutlined />} type='text'></Button>
          </Popover>,
        ]}
        author={
          <Link className={styles.postCommentAuthor} to={`/user/${comment.user.id}`}>
            <NameWithCountryFlag
              country={comment.user.country || undefined}
              name={comment.user.username}
            />
          </Link>
        }
        avatar={<Avatar src={comment.user.avatarUrl} alt='User avatar' />}
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
        {showReplyEditor ? (
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
