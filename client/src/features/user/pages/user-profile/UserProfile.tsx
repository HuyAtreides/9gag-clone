import {
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
  UserAddOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Popover, Skeleton } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import { useAppSelector } from '../../../../Store';
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
  // {
  //   key: 'Following Posts',
  //   tab: 'Following Posts',
  // },
  // {
  //   key: 'Following Users',
  //   tab: 'Following Users',
  // },
];

const tabKeyToTabContent: Record<string, React.FC<{ userId: number }>> = {
  Posts: UserPosts,
  'Saved Posts': UserSavedPosts,
  'Upvoted Posts': UserUpvotedPosts,
};

const UserProfile: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);
  const [selectedTab, setSelectedTab] = useState<string>('Posts');
  const { id } = useParams();
  const userId = !id ? user?.id : Number.parseInt(id);

  if (userId !== undefined && Number.isNaN(userId)) {
    return <Navigate to='/' />;
  }

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
              <Button icon={<SettingOutlined />} type='text'>
                Settings
              </Button>
              <Button type='text' icon={<EditOutlined />}>
                Edit
              </Button>
              <Button type='text' icon={<UserAddOutlined />}>
                Follow
              </Button>
              <Button type='text' icon={<WarningOutlined />}>
                Report
              </Button>
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
        </Skeleton>
      }
    >
      {!userId ? null : React.createElement(tabKeyToTabContent[selectedTab], { userId })}
    </Card>
  );
};

export default UserProfile;
