import {
  ExportOutlined,
  ImportOutlined,
  KeyOutlined,
  SendOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Menu, MenuProps, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import UserAccountSettings from '../../components/user-account-settings/UserAccountSettings';
import UserFollowRequests from '../../components/user-follow-requests/UserFollowRequests';
import UserPasswordSettings from '../../components/user-password-settings/UserPasswordSettings';
import styles from './UserSettings.module.scss';
import UserBlockingList from '../../components/user-blocking-list/UserBlockingList';

type MenuItem = Required<MenuProps>['items'][number];
type ItemKey =
  | 'account'
  | 'password'
  | 'received-follow-requests'
  | 'sent-follow-requests'
  | 'blocking';
const validItemKeys: ItemKey[] = [
  'account',
  'password',
  'received-follow-requests',
  'sent-follow-requests',
  'blocking',
];

const items: MenuItem[] = [
  {
    key: 'account',
    label: (
      <Link to={`/user/settings/account`} className={styles.menuLink}>
        Account
      </Link>
    ),
    icon: <UserOutlined />,
  },
  {
    key: 'password',
    label: (
      <Link to={`/user/settings/password`} className={styles.menuLink}>
        Password
      </Link>
    ),
    icon: <KeyOutlined />,
  },
  {
    key: 'requests',
    label: 'Follow Requests',
    icon: <SendOutlined />,
    children: [
      {
        key: 'received-follow-requests',
        label: (
          <Link
            to={`/user/settings/received-follow-requests`}
            className={styles.menuLink}
          >
            Received Requests
          </Link>
        ),
        icon: <ImportOutlined />,
      },
      {
        key: 'sent-follow-requests',
        label: (
          <Link to={`/user/settings/sent-follow-requests`} className={styles.menuLink}>
            Sent Requests
          </Link>
        ),
        icon: <ExportOutlined />,
      },
    ],
  },
  {
    key: 'blocking',
    label: (
      <Link to={`/user/settings/blocking`} className={styles.menuLink}>
        Blocking
      </Link>
    ),
    icon: <StopOutlined />,
  },
];

const MENU_ITEM_KEY_TO_CONTENT: Record<ItemKey, React.ReactNode> = {
  account: <UserAccountSettings />,
  password: <UserPasswordSettings />,
  'received-follow-requests': <UserFollowRequests />,
  'sent-follow-requests': <UserFollowRequests />,
  blocking: <UserBlockingList />,
};

const UserSettings: React.FC = () => {
  const { itemKey } = useParams();
  const key = itemKey as ItemKey;
  const [currentItemKey, setCurrentItemKey] = useState<ItemKey>(key ? key : 'account');

  useEffect(() => {
    setCurrentItemKey(key);
  }, [key]);

  if (!validItemKeys.includes(key)) {
    return <Navigate to='/user/settings/account' />;
  }

  return (
    <Row className={styles.userSettingsContainer}>
      <Col className={styles.menuContainer} xs={24} lg={6}>
        <Menu
          onClick={(menuInfo) => {
            setCurrentItemKey(menuInfo.key as ItemKey);
          }}
          defaultOpenKeys={['requests']}
          selectedKeys={[currentItemKey]}
          items={items}
          theme='dark'
          mode='inline'
        />
      </Col>
      <Col className={styles.menuContainerHorizontal} xs={24} lg={6}>
        <Menu
          onClick={(menuInfo) => {
            setCurrentItemKey(menuInfo.key as ItemKey);
          }}
          mode='horizontal'
          selectedKeys={[currentItemKey]}
          items={items}
          theme='light'
        />
      </Col>
      <Col xs={24} lg={18} className={styles.menuItemContainer}>
        {MENU_ITEM_KEY_TO_CONTENT[currentItemKey]}
      </Col>
    </Row>
  );
};

export default UserSettings;
