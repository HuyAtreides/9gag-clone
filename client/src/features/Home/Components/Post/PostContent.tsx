import {
  BookOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, message, Modal, Popover, Typography } from 'antd';
import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import OwnerGuard from '../../../../components/component-guard/OwnerGuard';
import Media from '../../../../components/media/Media';
import useDownvote from '../../../../custom-hooks/downvote';
import useProtectedAction from '../../../../custom-hooks/protected-action';
import useUpvote from '../../../../custom-hooks/upvote';
import useVirtualElement from '../../../../custom-hooks/virtual-element';
import VotePostActionExecutor from '../../../../custom-hooks/vote-action-executor/vote-post-action-executor';
import { Constant } from '../../../../models/enums/constant';
import { SortType } from '../../../../models/enums/sort-type';
import Post from '../../../../models/post';
import { useAppDispatch } from '../../../../Store';
import { remove, save, unSave } from '../../../../Store/post/post-dispatchers';
import { formatNumber } from '../../../../utils/format-number';
import styles from './PostContent.module.css';

interface Props {
  post: Post;
}

const PostContent: React.FC<Props> = ({ post }: Props) => {
  const [upvoted, downvoted] = [post.isUpvoted, post.isDownvoted];
  const dispatch = useAppDispatch();
  const votePostExecutorRef = useRef(new VotePostActionExecutor(dispatch, post));
  const handleUpvote = useUpvote(post, votePostExecutorRef.current);
  const handleDownvote = useDownvote(post, votePostExecutorRef.current);
  const protectAction = useProtectedAction();
  const [isVisibleInViewPort, virtualElementRef] = useVirtualElement(
    Constant.PostScrollAreaId,
  );
  const { tag } = useParams();

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `${process.env.REACT_APP_APP_URL}/post/${post.id}`,
    );
    message.success('Link copied!');
  };

  const savePost = () => {
    if (post.isSaved) {
      dispatch(unSave(post));
      return;
    }

    dispatch(save(post));
  };

  const deletePost = () => {
    Modal.confirm({
      onOk: () => {
        dispatch(remove(post));
        return false;
      },
      title: 'Do you want to delete this post?',
    });
  };

  if (!isVisibleInViewPort) {
    return <div className={styles['virtual-post']} ref={virtualElementRef}></div>;
  }

  return (
    <div ref={virtualElementRef} className={styles['list-item']}>
      <List.Item
        extra={[
          <Popover
            placement='bottom'
            trigger='click'
            content={
              <div className='more-action-box-container'>
                <Button
                  icon={<BookOutlined />}
                  onClick={protectAction(savePost)}
                  type={post.isSaved ? 'primary' : 'text'}
                >
                  {post.isSaved ? 'Unsave' : 'Save'}
                </Button>
                <OwnerGuard
                  component={
                    <Button
                      danger
                      type='text'
                      className='full-width-btn'
                      icon={<DeleteOutlined />}
                      onClick={deletePost}
                    >
                      Delete
                    </Button>
                  }
                  owner={post.user}
                />

                <Button
                  type='text'
                  className='full-width-btn'
                  icon={<CopyOutlined />}
                  onClick={copyLink}
                >
                  Copy Link
                </Button>
              </div>
            }
          >
            <Button icon={<MoreOutlined />} type='text' />
          </Popover>,
        ]}
        actions={[
          <Button
            icon={<CaretUpOutlined />}
            type={upvoted ? 'primary' : 'default'}
            onClick={protectAction(handleUpvote)}
          >
            {formatNumber(post.upvotes)}
          </Button>,
          <Button
            icon={<CaretDownOutlined />}
            type={downvoted ? 'primary' : 'default'}
            onClick={protectAction(handleDownvote)}
          >
            {formatNumber(post.downvotes)}
          </Button>,
          <Button
            icon={<CommentOutlined />}
            onClick={protectAction(() => window.open(`/post/${post.id}`, '_blank'))}
          >
            {formatNumber(post.totalComments)}
          </Button>,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src={post.section.imgUrl} />}
          title={
            <Link to={`/tag/${tag ? tag : SortType.FRESH}/${post.section.name}`}>
              <Typography.Link>{post.section.displayName}</Typography.Link>
            </Link>
          }
          description={
            <>
              {`Uploaded by `}{' '}
              <Link to={`/user/${post.user.username}`}>{post.user.username}</Link> &#8226;{' '}
              {post.uploadTime.toLocaleDateString()}
            </>
          }
        />
        <Typography.Title level={4}>{post.title}</Typography.Title>
        <Media
          type={post.mediaType}
          url={post.mediaUrl}
          scrollAreaId={Constant.PostScrollAreaId as string}
        />
      </List.Item>
    </div>
  );
};

export default React.memo(
  PostContent,
  (prevProps, nextProps) => prevProps.post === nextProps.post,
);
