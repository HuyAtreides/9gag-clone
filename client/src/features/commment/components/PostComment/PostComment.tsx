import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Avatar, Button, Comment, Typography } from 'antd';
import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentEditor from '../../../../components/comment-editor/CommentEditor';
import { User } from '../../../../models/user';
import styles from './PostComment.module.scss';

interface Props {
  readonly children?: ReactNode[];
  readonly user: User;
}

const PostComment: React.FC<Props> = ({ children, user }: Props) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  return (
    <Comment
      actions={[
        <Button
          icon={<CaretUpOutlined className='icon' />}
          type='text'
          className={styles.actionBtn}
        >
          <span className={styles.commentAction}>{10}</span>
        </Button>,
        <Button
          icon={<CaretDownOutlined className='icon' />}
          type='text'
          className={styles.actionBtn}
        >
          <span className={styles.commentAction}>{4}</span>
        </Button>,
        <Button
          key='comment-nested-reply-to'
          className={`${styles.commentAction} ${styles.actionBtn}`}
          type='text'
          onClick={() => setShowReplyEditor(!showReplyEditor)}
        >
          Reply to
        </Button>,
      ]}
      author={
        <Link className={styles.postCommentAuthor} to='/'>
          {user.displayName}
        </Link>
      }
      avatar={<Avatar src={user.avatarUrl} alt='Han Solo' />}
      content={
        <Typography.Paragraph className={styles.postCommentText}>
          We supply a series of design principles, practical patterns and high quality
          design resources (Sketch and Axure).
        </Typography.Paragraph>
      }
    >
      {showReplyEditor ? (
        <CommentEditor user={user} handleCancel={() => setShowReplyEditor(false)} />
      ) : null}
      {children}
    </Comment>
  );
};

export default PostComment;
