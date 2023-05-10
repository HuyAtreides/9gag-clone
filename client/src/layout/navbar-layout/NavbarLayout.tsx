import { EditFilled, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Popover, Typography } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticatedGuard from '../../components/component-guard/AuthenticatedGuard';
import useProtectedAction from '../../custom-hooks/protected-action';
import { useAppDispatch, useAppSelector } from '../../Store';
import { logout } from '../../Store/auth/auth-dispatchers';
import NotificationContainer from './components/notifications-container/NotificationContainer';
import PostSearch from './components/post-search/PostSearch';
import styles from './Navbar.module.scss';
import DropdownMenu from './components/DropdownMenu';

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
  const [showMenu, setShowMenu] = useState(false);

  const hideMenu = () => {
    setShowMenu(false);
    window.scrollTo(0, 0);
  };

  const handlerLogout = () => {
    hideMenu();
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
          <Typography.Text
            className={styles.text}
            onClick={protectAction(() => {})}
            ellipsis
            title={user?.displayName}
          >
            {user ? user.displayName : 'Sign up/Log in'}
          </Typography.Text>
          <Popover
            getPopupContainer={(container) => container.parentElement!}
            placement='bottom'
            trigger='click'
            visible={showMenu}
            onVisibleChange={setShowMenu}
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
                    <Link className={styles.btnDropdown} to={`/user`} onClick={hideMenu}>
                      Profile
                    </Link>
                  }
                />
                <AuthenticatedGuard
                  component={
                    <Link
                      className={styles.btnDropdown}
                      to={`/user/${user?.id}/saved-posts`}
                      onClick={hideMenu}
                    >
                      Saved Posts
                    </Link>
                  }
                />
                <AuthenticatedGuard
                  component={
                    <Link
                      className={styles.btnDropdown}
                      to='/user/settings'
                      onClick={hideMenu}
                    >
                      Settings
                    </Link>
                  }
                />
                <DropdownMenu />
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
