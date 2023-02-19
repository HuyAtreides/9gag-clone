import {
  BellFilled,
  EditFilled,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Input, Layout, Popover, Typography } from 'antd';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef } from 'react';
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
const DEBOUNCE_TIME_IN_MILI_SECONDS = 700;

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
    }, DEBOUNCE_TIME_IN_MILI_SECONDS),
    [],
  );

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
                  onChange={handleSearch}
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
                  <button
                    className={styles.btnDropdown}
                    onClick={protectAction(() => {})}
                  >
                    Sign up/Log in
                  </button>
                )}
                <AuthenticatedGuard
                  component={
                    <Link
                      className={styles.btnDropdown}
                      to='/'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Profile
                    </Link>
                  }
                />
                <AuthenticatedGuard
                  component={
                    <Link
                      className={styles.btnDropdown}
                      to='/'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Saved Posts
                    </Link>
                  }
                />
              </div>
            }
          >
            <Button className={styles.avatar} shape='circle'>
              <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
            </Button>
          </Popover>
          <Button
            onClick={protectAction(() => navigate('../add-post'))}
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
