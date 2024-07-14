import {
  BookOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  GlobalOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, Modal, Tag, Typography, message } from 'antd';
import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../../Store';
import {
  disableAnonymous,
  enableAnonymous,
  follow,
  remove,
  save,
  turnOffNotification,
  turnOnNotification,
  unFollow,
  unSave,
} from '../../../../Store/post/post-dispatchers';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import OwnerGuard from '../../../../components/component-guard/OwnerGuard';
import FollowButton from '../../../../components/follow-button/FollowButton';
import Media from '../../../../components/media/Media';
import PostTitle from '../../../../components/post-title/PostTitle';
import ReportButton from '../../../../components/report-button/ReportButton';
import ShareButton from '../../../../components/share-button/ShareButton';
import SharedPostContainer from '../../../../components/shared-post/SharedPostContainer';
import ToggleNotificationButton from '../../../../components/toggle-notification-button/ToggleNotificationButton';
import VirtualComponent from '../../../../components/virtual-component/VirtualComponent';
import WYSIWYGView from '../../../../components/wysiwyg-view/WYSIWYGView';
import useDownvote from '../../../../custom-hooks/downvote';
import useFollow from '../../../../custom-hooks/follow';
import useProtectedAction from '../../../../custom-hooks/protected-action';
import useToggleNotification from '../../../../custom-hooks/toggle-notification';
import useUpvote from '../../../../custom-hooks/upvote';
import useTimeDiffFromToday from '../../../../custom-hooks/use-time-diff-from-today';
import VotePostActionExecutor from '../../../../custom-hooks/vote-action-executor/vote-post-action-executor';
import { Constant } from '../../../../models/enums/constant';
import { PostContentType } from '../../../../models/enums/post-content-type';
import { SortType } from '../../../../models/enums/sort-type';
import Post from '../../../../models/post';
import { formatNumber } from '../../../../utils/format-number';
import styles from './PostContent.module.css';
import UpdatePostPrivacy from './UpdatePostPrivacy';
import useOwnerProtectedAction from '../../../../custom-hooks/owner-protected-action';

interface Props {
  post: Post;
}
const PostMedia: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Media
      type={post.mediaType}
      nsfw={post.nsfw}
      url={post.mediaUrl}
      scrollAreaId={Constant.PostScrollAreaId as string}
    />
  );
};

const PostText: React.FC<{ post: Post }> = ({ post }) => {
  return <WYSIWYGView content={post.text} />;
};

const POST_CONTENT_TYPE_TO_CONTENT_MAP: Readonly<
  Record<PostContentType, React.FC<{ post: Post; reserveState?: any }>>
> = {
  [PostContentType.MEDIA]: PostMedia,
  [PostContentType.TEXT]: PostText,
  [PostContentType.SHARED_POST]: SharedPostContainer,
};

const PostContent: React.FC<Props> = ({ post }: Props) => {
  const dispatch = useAppDispatch();
  const [openUpdatePrivacy, setOpenUpdatePrivacy] = useState(false);
  const [upvoted, downvoted] = [post.isUpvoted, post.isDownvoted];
  const votePostExecutorRef = useRef(new VotePostActionExecutor(dispatch, post));
  const handleUpvote = useUpvote(post, votePostExecutorRef.current);
  const handleDownvote = useDownvote(post, votePostExecutorRef.current);
  const protectAction = useProtectedAction();
  const ownerProtectAction = useOwnerProtectedAction(post.user);
  const followPost = useFollow({
    isFollowed: post.followed,
    followThunkAction: follow(post),
    unFollowThunkAction: unFollow(post),
  });
  const toggleSendNotifications = useToggleNotification({
    notificationEnabled: post.notificationEnabled,
    turnOnNotificationThunkAction: turnOnNotification(post),
    turnOffNotificationThunkAction: turnOffNotification(post),
  });
  const uploadTimeDiffFromToday = useTimeDiffFromToday(post.uploadTime);
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

  const setPostAnonymous = () => {
    if (post.anonymous) {
      dispatch(disableAnonymous(post));
      return;
    }

    dispatch(enableAnonymous(post));
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

  const updatePrivacy = () => {
    setOpenUpdatePrivacy(true);
  };

  const closeUpdatePrivacy = () => {
    setOpenUpdatePrivacy(false);
  };

  const postCreatorAction = post.sharedPostId !== null ? 'Shared By' : 'Uploaded By';

  return (
    <VirtualComponent scrollAreaId={Constant.PostScrollAreaId as string}>
      <div className={styles['list-item']}>
        <List.Item
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
            <div className={styles.shareButtonContainer}>
              <ShareButton post={post} />
              <Button type='text' icon={<CopyOutlined />} onClick={copyLink}>
                Copy Link
              </Button>
              <Button
                icon={<BookOutlined />}
                onClick={protectAction(savePost)}
                type={post.isSaved ? 'primary' : 'text'}
              >
                {post.isSaved ? 'Unsave' : 'Save'}
              </Button>
            </div>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={post.section.imgUrl} />}
            title={
              <div className={styles.postHeader}>
                <Link to={`/tag/${tag ? tag : SortType.FRESH}/${post.section.name}`}>
                  <Typography.Link>{post.section.displayName}</Typography.Link>
                </Link>
                <AutoClosePopover
                  closeAfterClicked={false}
                  content={
                    <>
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
                            icon={<UserOutlined />}
                            type={post.anonymous ? 'primary' : 'text'}
                            className='full-width-btn'
                            onClick={setPostAnonymous}
                          >
                            {post.anonymous ? 'Turn off anonymous' : 'Turn on anonymous'}
                          </Button>
                        }
                      />
                      <OwnerGuard
                        owner={post.user}
                        component={
                          <ToggleNotificationButton
                            notificationEnabled={post.notificationEnabled}
                            handleToggle={toggleSendNotifications}
                          />
                        }
                        replace={
                          <FollowButton
                            followed={post.followed}
                            handleFollow={followPost}
                          />
                        }
                      />
                      {post.user ? (
                        <OwnerGuard
                          component={<></>}
                          replace={
                            <ReportButton
                              user={post.user}
                              contentURL={`${process.env.REACT_APP_APP_URL}/post/${post.id}`}
                            />
                          }
                          owner={post.user}
                        />
                      ) : null}
                      <div className={styles.shareButtonContainerSmallBreakpoint}>
                        <ShareButton post={post} />
                      </div>
                    </>
                  }
                >
                  <Button icon={<MoreOutlined />} type='text' />
                </AutoClosePopover>
              </div>
            }
            description={
              <>
                {postCreatorAction}{' '}
                {!post.anonymous ? (
                  <Link to={`/user/${post.user!.id}`}>{post.user!.username}</Link>
                ) : (
                  'an anonymous user'
                )}{' '}
                &#8226;{' '}
                {post.moderating ? 'Moderating Content...' : uploadTimeDiffFromToday}{' '}
                &#8226;
                {post.followersOnly ? (
                  <Button
                    title='Followers'
                    icon={<TeamOutlined />}
                    type='text'
                    onClick={ownerProtectAction(updatePrivacy)}
                  />
                ) : (
                  <Button
                    title='Everyone'
                    icon={<GlobalOutlined />}
                    type='text'
                    onClick={ownerProtectAction(updatePrivacy)}
                  />
                )}
              </>
            }
          />
          <PostTitle title={post.title} />
          {React.createElement(POST_CONTENT_TYPE_TO_CONTENT_MAP[post.contentType], {
            post,
          })}
          <div>
            {post.tags.map((tag) => (
              <Tag className={styles.tag}>{tag}</Tag>
            ))}
          </div>
          <UpdatePostPrivacy
            post={post}
            open={openUpdatePrivacy}
            close={closeUpdatePrivacy}
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
