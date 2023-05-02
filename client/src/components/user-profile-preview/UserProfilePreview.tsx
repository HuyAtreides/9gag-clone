import { Avatar, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useState } from 'react';
import UserFollowers from '../../features/user/components/user-followers/UserFollowers';
import UserFollowing from '../../features/user/components/user-following/UserFollowing';
import UserPosts from '../../features/user/components/user-posts/UserPosts';
import { User } from '../../models/user';
import NameWithCountryFlag from '../name-with-country-flag/NameWithCountryFlag';
import UserStats from '../user-stats/UserStats';
import { InfiniteScrollHeight } from '../../context/infinite-scroll-height';
import { Link } from 'react-router-dom';

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

const UserProfilePreview: React.FC<{ user: User }> = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState<string>('Stats');

  return (
    <Card
      loading={!user}
      tabList={tabListNoTitle}
      activeTabKey={selectedTab}
      bordered={false}
      onTabChange={setSelectedTab}
      title={
        <>
          <Meta
            avatar={<Avatar src={user?.avatarUrl} size={70} />}
            title={
              <Link to={`/user/${user?.id}`}>
                <strong>{user?.displayName}</strong>
              </Link>
            }
            description={
              <span>
                <NameWithCountryFlag
                  country={user?.country || undefined}
                  name={user?.username || ''}
                />{' '}
                &#8226; Joined in {user?.created.toLocaleDateString()}
              </span>
            }
          />
          <br></br>
        </>
      }
    >
      <InfiniteScrollHeight.Provider value='55vh'>
        {React.createElement(tabKeyToTabContent[selectedTab], { userId: user.id })}
      </InfiniteScrollHeight.Provider>
    </Card>
  );
};

export default UserProfilePreview;
