import { EditFilled, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Popover, Typography } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticatedGuard from '../../components/component-guard/AuthenticatedGuard';
import useProtectedAction from '../../custom-hooks/protected-action';
import { useAppDispatch, useAppSelector } from '../../Store';
import { logout } from '../../Store/auth/auth-dispatchers';
import NotificationContainer from './components/notifications-container/NotificationContainer';
import PostSearch from './components/post-search/PostSearch';
import styles from './Navbar.module.scss';

const { Header } = Layout;

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

  const handlerLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

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
            9GAG
          </Link>
        </div>
        <div className={styles.itemContainer}>
          <PostSearch />
          <NotificationContainer />
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
