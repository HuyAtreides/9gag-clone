import {
  BellFilled,
  EditFilled,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Input, Layout, Popover, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticatedGuard from '../../components/component-guard/AuthenticatedGuard';
import useProtectedAction from '../../custom-hooks/protected-action';
import { useAppDispatch, useAppSelector } from '../../Store';
import { logout } from '../../Store/auth/auth-dispatchers';
import {
  countNotViewed,
  initialize,
} from '../../Store/notification/notification-dispatchers';
import { clearNotViewedCount } from '../../Store/notification/notification-slice';
import { setSearchTerm } from '../../Store/post/post-slice';
import DropdownMenu from './components/DropdownMenu';
import Notifications from './components/Notifications';
import styles from './Navbar.module.scss';

const { Header } = Layout;
const promiseWithUndefinedValue = Promise.resolve(undefined);
export const IntervalIdContext = React.createContext<Promise<undefined | NodeJS.Timer>>(
  promiseWithUndefinedValue,
);

interface INavbarLayout {
  collapse: boolean;
  setCollapse: (value: boolean) => void;
}

/** Common layout for other features. */
const NavbarLayout: React.FC<INavbarLayout> = ({ collapse, setCollapse }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.profile);
  const protectAction = useProtectedAction();
  const notViewedCount = useAppSelector((state) => state.notification.notViewedCount);
  const intervalRef = useRef<Promise<undefined | NodeJS.Timer>>(
    promiseWithUndefinedValue,
  );

  const handlerLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const clearNotViewedNotificationsCount = () => {
    dispatch(clearNotViewedCount());
  };

  useEffect(() => {
    dispatch(countNotViewed());

    if (user) {
      intervalRef.current = (async () => {
        const intervalId = await dispatch(initialize());
        return intervalId as unknown as undefined | NodeJS.Timer;
      })();
    }
  }, [dispatch, user]);

  return (
    <Header className={styles.header}>
      <div className={styles.navbarContainer}>
        <div className={styles.itemContainer}>
          <Button
            shape='circle'
            icon={<MenuOutlined />}
            className={styles.iconCollapse}
            onClick={() => setCollapse(!collapse)}
          />
          <Link to='./' className={styles.logo}>
            9GAP
          </Link>
        </div>
        <div className={styles.itemContainer}>
          <Popover
            placement='bottom'
            trigger='click'
            content={
              <div className={styles.searchContainer}>
                <Input
                  className={styles.searchInput}
                  bordered={false}
                  size='large'
                  placeholder='Search...'
                  onPressEnter={(e) => dispatch(setSearchTerm(e.currentTarget.value))}
                  prefix={<SearchOutlined />}
                />
              </div>
            }
          >
            <Button
              shape='circle'
              icon={<SearchOutlined />}
              className={styles.iconCollapse}
            />
          </Popover>
          <AuthenticatedGuard
            component={
              <Popover
                placement='bottom'
                trigger='click'
                content={
                  <IntervalIdContext.Provider value={intervalRef.current}>
                    <Notifications />
                  </IntervalIdContext.Provider>
                }
              >
                <Badge count={notViewedCount}>
                  <Button
                    shape='circle'
                    icon={<BellFilled />}
                    className={styles.iconCollapse}
                    onClick={clearNotViewedNotificationsCount}
                  />
                </Badge>
              </Popover>
            }
          />
          <Typography.Text className={styles.text} onClick={protectAction(() => {})}>
            {user ? user.displayName : 'Sign up/Log in'}
          </Typography.Text>
          <Popover
            placement='bottom'
            trigger='click'
            content={
              <div className={styles.navbarDropdown}>
                {user ? (
                  <button className={styles.btnDropdown} onClick={() => handlerLogout()}>
                    Log out
                  </button>
                ) : (
                  ''
                )}
                <a
                  className={styles.btnDropdown}
                  href='https://about.9gag.com/app'
                  target='_blank'
                  rel='noreferrer'
                >
                  Download 9GAG app
                </a>
                <a
                  className={styles.btnDropdown}
                  href='https://9gag.helpshift.com/hc/en/'
                  target='_blank'
                  rel='noreferrer'
                >
                  Help center
                </a>
                <a
                  className={styles.btnDropdown}
                  href='https://9gag.helpshift.com/hc/en/3-9gag/contact-us/'
                  target='_blank'
                  rel='noreferrer'
                >
                  Report problems
                </a>
                <DropdownMenu />
              </div>
            }
          >
            <Button className={styles.avatar} shape='circle'>
              <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
            </Button>
          </Popover>
          <Button
            onClick={protectAction(() => navigate('../post'))}
            type='primary'
            icon={<EditFilled />}
            className={styles.btnPost}
          >
            Post
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default NavbarLayout;
