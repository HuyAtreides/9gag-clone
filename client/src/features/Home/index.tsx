import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserSearch from '../../components/user-search/UserSearch';
import SideBarLayout from '../../layout/sidebar-layout/SidebarLayout';
import PostWithComment from './Components/post-with-comment/PostWithComment';
import styles from './Home.module.scss';
import PostList from './pages/post-list/PostList';
import AuthenticatedGuard from '../../components/component-guard/AuthenticatedGuard';

interface IHomeProp {
  readonly sideBarCollapse: boolean;
  readonly setSideBarCollapse: (collapse: boolean) => void;
}

const Home: React.FC<IHomeProp> = ({ sideBarCollapse, setSideBarCollapse }) => {
  return (
    <SideBarLayout
      sideBarCollapse={sideBarCollapse}
      setSideBarCollapse={setSideBarCollapse}
    >
      <div className={styles.container}>
        <div className={styles.homeContent}>
          <Routes>
            <Route path=':id' element={<PostWithComment />} />
            <Route path='' element={<PostList />} />
          </Routes>
        </div>
        <AuthenticatedGuard
          component={
            <div className={styles.userSearch}>
              <UserSearch />
            </div>
          }
        />
      </div>
    </SideBarLayout>
  );
};

export default Home;
