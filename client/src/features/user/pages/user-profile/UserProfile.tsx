import {
  AudioMutedOutlined,
  AudioOutlined,
  EditOutlined,
  MessageOutlined,
  MoreOutlined,
  SettingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Empty,
  Image,
  Modal,
  Skeleton,
  Tabs,
  Typography,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { createNewConversation } from '../../../../Store/chat/chat-dispatchers';
import {
  block,
  cancelRequest,
  follow,
  getSpecificUser,
  restrict,
  sendRequest,
  unFollow,
  unRestrict,
} from '../../../../Store/user/user-dipatchers';
import {
  resetOtherProfileState,
  setUserErrorMessage,
} from '../../../../Store/user/user-slice';
import UserFollowButton from '../../../../components/UserFollowButton/UserFollowButton';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import OwnerGuard from '../../../../components/component-guard/OwnerGuard';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import PrivateProfileGuard from '../../../../components/private-profile-guard/PrivateProfileGuard';
import UserStats from '../../../../components/user-stats/UserStats';
import useFollow from '../../../../custom-hooks/follow';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import useSendFollowRequest from '../../../../custom-hooks/send-follow-request';
import UserComments from '../../components/user-comments/UserComments';
import UserFollowers from '../../components/user-followers/UserFollowers';
import UserFollowingPosts from '../../components/user-following-posts/UserFollowingPosts';
import UserFollowing from '../../components/user-following/UserFollowing';
import UserPosts from '../../components/user-posts/UserPosts';
import UserSavedPosts from '../../components/user-saved-posts/UserSavedPosts';
import UserUpvotedPosts from '../../components/user-upvoted-posts/UserUpvotedPosts';
import { UserProfileContext } from '../../context/context';
import styles from './UserProfile.module.scss';
import ReportButton from '../../../../components/report-button/ReportButton';

const tabListNoTitle = [
  {
    key: 'Posts',
    tab: 'Posts',
  },
  {
    key: 'Saved Posts',
    tab: 'Saved Posts',
  },
  {
    key: 'Upvoted Posts',
    tab: 'Upvoted Posts',
  },
  {
    key: 'Following Posts',
    tab: 'Following Posts',
  },
  {
    key: 'Comments',
    tab: 'Comments',
  },
  {
    key: 'Followers',
    tab: 'Followers',
  },
  {
    key: 'Following',
    tab: 'Following',
  },
];

const PARAM_TO_TAB_KEY: Record<string, string> = {
  posts: 'Posts',
  'saved-posts': 'Saved Posts',
  'upvoted-posts': 'Upvoted Posts',
  'following-posts': 'Following Posts',
  comments: 'Comments',
  followers: 'Followers',
  following: 'Following',
};

const tabKeyToTabContent: Record<string, React.FC<{ userId: number }>> = {
  Posts: UserPosts,
  'Saved Posts': UserSavedPosts,
  'Upvoted Posts': UserUpvotedPosts,
  'Following Posts': UserFollowingPosts,
  Comments: UserComments,
  Followers: UserFollowers,
  Following: UserFollowing,
};

const UserProfile: React.FC = () => {
  const user = useAppSelector((state) => state.user.otherProfile!);
  const isLoading = useAppSelector((state) => state.user.isGettingOtherProfile);
  const currentUser = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id, tab } = useParams();
  const tabKey = tab && PARAM_TO_TAB_KEY[tab] ? PARAM_TO_TAB_KEY[tab] : 'Posts';
  const [selectedTab, setSelectedTab] = useState<string>(tabKey);
  const userId = !id ? undefined : Number.parseInt(id);
  const followUser = useFollow({
    isFollowed: user?.followed || false,
    followThunkAction: follow(user?.id || -1),
    unFollowThunkAction: unFollow(user?.id || -1),
  });
  const sendFollowRequest = useSendFollowRequest({
    receivedRequest: user?.receivedFollowRequest || false,
    sendRequestThunkAction: sendRequest(user?.id || -1),
    cancelRequestThunkAction: cancelRequest(user?.id || -1),
  });
  const errorMessage = useAppSelector((state) => state.user.errorMessage);
  useRenderErrorMessage(errorMessage, setUserErrorMessage);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (!userId || Number.isNaN(userId)) {
      navigate(`/user/${currentUser.id}`);
      return;
    }

    dispatch(getSpecificUser(userId));
  }, [currentUser, dispatch, navigate, userId]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    const param = Object.keys(PARAM_TO_TAB_KEY).find(
      (key) => PARAM_TO_TAB_KEY[key] === tab,
    );
    navigate(`/user/${userId}/${param}`);
  };

  const handleBlock = () => {
    if (!user) {
      return;
    }

    Modal.confirm({
      onOk: async () => {
        await dispatch(block(user.id));
      },
      title: 'Do you want to block this user?',
    });
  };

  const handleRestrict = () => {
    if (!user) {
      return;
    }
    Modal.confirm({
      onOk: async () => {
        if (user.restricted) {
          await dispatch(unRestrict(user.id));
        } else {
          await dispatch(restrict(user.id));
        }
      },
      title: !user.restricted
        ? 'Do you want to restrict this user?'
        : 'Do you want to unrestrict this user?',
    });
  };

  useEffect(() => {
    return () => {
      dispatch(resetOtherProfileState());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    setSelectedTab(tabKey);
  }, [tabKey]);

  if (!isLoading && !user && currentUser) {
    return (
      <Empty
        description={
          <Typography.Title level={4} type='secondary'>
            User Not Found
          </Typography.Title>
        }
      />
    );
  }

  return (
    <UserProfileContext.Provider value={user}>
      <Card
        className={styles.userProfile}
        loading={!user}
        cover={<Image src={user?.coverImageUrl} />}
      >
        <Skeleton loading={!user} avatar active>
          <div className={styles.userMeta}>
            <Meta
              avatar={<Avatar src={user?.avatarUrl} size={70} />}
              title={<strong title={user?.displayName}>{user?.displayName}</strong>}
              description={
                <span className={styles.cardDescription}>
                  <NameWithCountryFlag
                    country={user?.country || undefined}
                    name={user?.username || ''}
                  />{' '}
                  &#8226; Joined in {user?.created.toLocaleDateString()}
                </span>
              }
            />

            {!user ? null : (
              <AutoClosePopover
                placement='left'
                content={
                  <>
                    <OwnerGuard
                      component={
                        <Button
                          icon={<SettingOutlined />}
                          type='text'
                          onClick={() => navigate('/user/settings')}
                        >
                          Settings
                        </Button>
                      }
                      owner={user}
                    />
                    <OwnerGuard
                      component={
                        <Button
                          type='text'
                          icon={<EditOutlined />}
                          onClick={() => navigate('/user/settings')}
                        >
                          Edit
                        </Button>
                      }
                      owner={user}
                    />
                    <OwnerGuard
                      component={<></>}
                      replace={
                        <UserFollowButton
                          hasIcon={true}
                          followUser={followUser}
                          sendRequest={sendFollowRequest}
                          user={user}
                        />
                      }
                      owner={user}
                    />

                    <OwnerGuard
                      replace={
                        <Button
                          type='text'
                          icon={<MessageOutlined />}
                          onClick={() => dispatch(createNewConversation(user.id))}
                        >
                          Chat
                        </Button>
                      }
                      component={<></>}
                      owner={user}
                    />

                    <OwnerGuard
                      component={<></>}
                      replace={<ReportButton user={user} reportProfile />}
                      owner={user}
                    />

                    <OwnerGuard
                      component={<></>}
                      replace={
                        <Button
                          type='text'
                          icon={
                            user.restricted ? <AudioOutlined /> : <AudioMutedOutlined />
                          }
                          onClick={handleRestrict}
                        >
                          {user.restricted ? 'Unrestrict' : 'Restrict'}
                        </Button>
                      }
                      owner={user}
                    />

                    <OwnerGuard
                      component={<></>}
                      replace={
                        <Button
                          type='text'
                          icon={<StopOutlined />}
                          danger
                          onClick={handleBlock}
                        >
                          Block
                        </Button>
                      }
                      owner={user}
                    />
                  </>
                }
              >
                <Button icon={<MoreOutlined />} type='text' />
              </AutoClosePopover>
            )}
          </div>

          <br></br>
          <Typography.Paragraph className={styles.about}>
            {user?.about}
          </Typography.Paragraph>
          {userId && <UserStats userId={userId} />}
        </Skeleton>

        {!userId ? null : (
          <Tabs
            size='large'
            activeKey={selectedTab}
            onChange={handleTabChange}
            destroyInactiveTabPane
          >
            {tabListNoTitle.map((tab) => (
              <Tabs.TabPane tab={tab.tab} key={tab.key}>
                <PrivateProfileGuard
                  component={
                    tab.key === selectedTab
                      ? React.createElement(tabKeyToTabContent[tab.key], {
                          userId,
                        })
                      : null
                  }
                  user={user}
                  replace={
                    <Empty
                      description={
                        <Typography.Text type='secondary' strong>
                          This user profile is private. Follow to view the user profile.
                        </Typography.Text>
                      }
                    />
                  }
                />
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </Card>
    </UserProfileContext.Provider>
  );
};

export default UserProfile;
