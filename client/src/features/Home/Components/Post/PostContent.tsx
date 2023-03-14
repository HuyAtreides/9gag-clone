import {
  BellFilled,
  BellOutlined,
  BookOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined,
  NotificationFilled,
  NotificationOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, message, Modal, Popover, Typography } from 'antd';
import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import OwnerGuard from '../../../../components/component-guard/OwnerGuard';
import Media from '../../../../components/media/Media';
import VirtualComponent from '../../../../components/virtual-component/VirtualComponent';
import useDownvote from '../../../../custom-hooks/downvote';
import useProtectedAction from '../../../../custom-hooks/protected-action';
import useUpvote from '../../../../custom-hooks/upvote';
import VotePostActionExecutor from '../../../../custom-hooks/vote-action-executor/vote-post-action-executor';
import { Constant } from '../../../../models/enums/constant';
import { SortType } from '../../../../models/enums/sort-type';
import Post from '../../../../models/post';
import { useAppDispatch } from '../../../../Store';
import {
  follow,
  remove,
  save,
  turnOffNotifications,
  turnOnNotifications,
  unFollow,
  unSave,
} from '../../../../Store/post/post-dispatchers';
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

  const followPost = () => {
    if (post.followed) {
      dispatch(unFollow(post));
      return;
    }

    dispatch(follow(post));
  };

  const toggleSendNotifications = () => {
    if (post.sendNotifications) {
      dispatch(turnOffNotifications(post));
      return;
    }

    dispatch(turnOnNotifications(post));
  };

  return (
    <VirtualComponent scrollAreaId={Constant.PostScrollAreaId as string}>
      <div className={styles['list-item']}>
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

                  <OwnerGuard
                    owner={post.user}
                    component={
                      <Button
                        type='text'
                        className='full-width-btn'
                        icon={post.sendNotifications ? <BellFilled /> : <BellOutlined />}
                        onClick={protectAction(toggleSendNotifications)}
                      >
                        {post.sendNotifications
                          ? 'Turn off notifications'
                          : 'Turn on notifications'}
                      </Button>
                    }
                    replace={
                      <Button
                        type='text'
                        className='full-width-btn'
                        icon={
                          post.followed ? (
                            <NotificationFilled />
                          ) : (
                            <NotificationOutlined />
                          )
                        }
                        onClick={protectAction(followPost)}
                      >
                        {post.followed ? 'Unfollow' : 'Follow'}
                      </Button>
                    }
                  />
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
                <Link to={`/user/${post.user.id}`}>{post.user.username}</Link> &#8226;{' '}
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
    </VirtualComponent>
  );
};

export default React.memo(
  PostContent,
  (prevProps, nextProps) => prevProps.post === nextProps.post,
);
