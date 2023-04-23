import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Menu, MenuProps, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import UserAccountSettings from '../../components/user-account-settings/UserAccountSettings';
import UserPasswordSettings from '../../components/user-password-settings/UserPasswordSettings';
import styles from './UserSettings.module.scss';

type MenuItem = Required<MenuProps>['items'][number];
type ItemKey = 'account' | 'password';
const validItemKeys: ItemKey[] = ['account', 'password'];

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
];

const MENU_ITEM_KEY_TO_CONTENT: Record<ItemKey, React.ReactNode> = {
  account: <UserAccountSettings />,
  password: <UserPasswordSettings />,
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
          selectedKeys={[currentItemKey]}
          items={items}
          theme='dark'
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
      <Col xs={24} lg={18}>
        {MENU_ITEM_KEY_TO_CONTENT[currentItemKey]}
      </Col>
    </Row>
  );
};

export default UserSettings;
