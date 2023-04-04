import {
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
  StopOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Popover, Skeleton } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  follow,
  getSpecificUser,
  unFollow,
} from '../../../../Store/user/user-dipatchers';
import { resetOtherProfileState } from '../../../../Store/user/user-slice';
import OwnerGuard from '../../../../components/component-guard/OwnerGuard';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import UserStats from '../../../../components/user-stats/UserStats';
import UserComments from '../../components/user-comments/UserComments';
import UserFollowingPosts from '../../components/user-following-posts/UserFollowingPosts';
import UserPosts from '../../components/user-posts/UserPosts';
import UserSavedPosts from '../../components/user-saved-posts/UserSavedPosts';
import UserUpvotedPosts from '../../components/user-upvoted-posts/UserUpvotedPosts';
import styles from './UserProfile.module.scss';

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
];

const tabKeyToTabContent: Record<string, React.FC<{ userId: number }>> = {
  Posts: UserPosts,
  'Saved Posts': UserSavedPosts,
  'Upvoted Posts': UserUpvotedPosts,
  'Following Posts': UserFollowingPosts,
  Comments: UserComments,
};

const UserProfile: React.FC = () => {
  const user = useAppSelector((state) => state.user.otherProfile!);
  const currentUser = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>('Posts');
  const { id } = useParams();
  const userId = !id ? undefined : Number.parseInt(id);

  const followUser = () => {
    if (user.followed) {
      dispatch(unFollow(user.id));
      return;
    }

    dispatch(follow(user.id));
  };

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

  useEffect(() => {
    return () => {
      dispatch(resetOtherProfileState());
    };
  }, [dispatch]);

  return (
    <Card
      className={styles.userProfile}
      loading={!user}
      extra={
        <Popover
          placement='left'
          trigger='click'
          content={
            <div className='more-action-box-container'>
              <OwnerGuard
                component={
                  <Button icon={<SettingOutlined />} type='text'>
                    Settings
                  </Button>
                }
                owner={user}
              />
              <OwnerGuard
                component={
                  <Button type='text' icon={<EditOutlined />}>
                    Edit
                  </Button>
                }
                owner={user}
              />
              <OwnerGuard
                component={<></>}
                replace={
                  <Button
                    type={user?.followed ? 'primary' : 'text'}
                    icon={<UserAddOutlined />}
                    onClick={followUser}
                  >
                    {user?.followed ? 'Unfollow' : 'Follow'}
                  </Button>
                }
                owner={user}
              />

              <OwnerGuard
                component={<></>}
                replace={
                  <Button type='text' icon={<StopOutlined />} danger>
                    Block
                  </Button>
                }
                owner={user}
              />
            </div>
          }
        >
          <Button icon={<MoreOutlined />} type='text' />
        </Popover>
      }
      tabList={tabListNoTitle}
      activeTabKey={selectedTab}
      onTabChange={setSelectedTab}
      title={
        <Skeleton loading={!user} avatar active>
          <Meta
            avatar={<Avatar src={user?.avatarUrl} size={70} />}
            title={<strong>{user?.displayName}</strong>}
            description={
              <>
                <NameWithCountryFlag
                  country={user?.country || undefined}
                  name={user?.username || ''}
                />{' '}
                &#8226; Joined in {user?.created.toLocaleDateString()}
              </>
            }
          />
          <br></br>
          {userId && <UserStats id={userId} />}
        </Skeleton>
      }
    >
      {!userId ? null : React.createElement(tabKeyToTabContent[selectedTab], { userId })}
    </Card>
  );
};

export default UserProfile;
