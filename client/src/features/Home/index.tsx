import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SideBarLayout from '../../layout/sidebar-layout/SidebarLayout';
import PostWithComment from './Components/post-with-comment/PostWithComment';
import PostList from './pages/post-list/PostList';
import styles from './Home.module.scss';

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
      <div className={styles.homeContent}>
        <Routes>
          <Route path=':id' element={<PostWithComment />} />
          <Route path='' element={<PostList />} />
        </Routes>
      </div>
    </SideBarLayout>
  );
};

export default Home;
