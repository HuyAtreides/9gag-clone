import { Avatar, Card, Empty, Skeleton, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store';
import { getSpecificUser } from '../../Store/user/user-dipatchers';
import { resetOtherProfileState } from '../../Store/user/user-slice';
import { InfiniteScrollHeight } from '../../context/infinite-scroll-height';
import UserFollowers from '../../features/user/components/user-followers/UserFollowers';
import UserFollowing from '../../features/user/components/user-following/UserFollowing';
import UserPosts from '../../features/user/components/user-posts/UserPosts';
import NameWithCountryFlag from '../name-with-country-flag/NameWithCountryFlag';
import PrivateProfileGuard from '../private-profile-guard/PrivateProfileGuard';
import UserStats from '../user-stats/UserStats';
import styles from './UserProfilePreview.module.scss';

const tabListNoTitle = [
  {
    key: 'Stats',
    tab: 'Stats',
  },
  {
    key: 'Posts',
    tab: 'Posts',
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

const tabKeyToTabContent: Record<string, React.FC<{ userId: number }>> = {
  Posts: UserPosts,
  Followers: UserFollowers,
  Following: UserFollowing,
  Stats: UserStats,
};

const UserProfilePreview: React.FC<{ userId: number }> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState<string>('Stats');
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.otherProfile);

  useEffect(() => {
    dispatch(getSpecificUser(userId));

    return () => {
      dispatch(resetOtherProfileState());
    };
  }, [dispatch, userId]);

  return (
    <Card
      loading={!user}
      tabList={tabListNoTitle}
      activeTabKey={selectedTab}
      bordered={false}
      onTabChange={setSelectedTab}
      title={
        <Skeleton loading={!user} avatar active>
          <Meta
            avatar={<Avatar src={user?.avatarUrl} size={70} />}
            title={
              <Link to={`/user/${user?.id}`}>
                <strong title={user?.displayName}>{user?.displayName}</strong>
              </Link>
            }
            description={
              <span className={styles.description}>
                <NameWithCountryFlag
                  country={user?.country || undefined}
                  name={user?.username || ''}
                />{' '}
                &#8226; Joined in {user?.created.toLocaleDateString()}
              </span>
            }
          />
          <br></br>
        </Skeleton>
      }
    >
      <InfiniteScrollHeight.Provider value='55vh'>
        {selectedTab === 'Stats' ? (
          React.createElement(tabKeyToTabContent[selectedTab], { userId: user?.id || -1 })
        ) : (
          <PrivateProfileGuard
            component={React.createElement(tabKeyToTabContent[selectedTab], {
              userId: user?.id || -1,
            })}
            user={user!}
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
        )}
      </InfiniteScrollHeight.Provider>
    </Card>
  );
};

export default UserProfilePreview;
