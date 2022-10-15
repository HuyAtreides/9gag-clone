import { Layout } from 'antd';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import styles from './Home.module.scss';
import PostList from './pages/post-list/PostList';

const { Sider, Content } = Layout;

interface IHomeProp {
  sideBarCollapse: boolean;
}

const Home: React.FC<IHomeProp> = ({ sideBarCollapse }) => {
  return (
    <Layout className={styles.home}>
      <Sider
        breakpoint='lg'
        collapsed={sideBarCollapse}
        collapsedWidth={0}
        className={styles.sidebar}
      >
        <Sidebar />
      </Sider>
      <Content className={styles.content}>
        <Routes>
          <Route path='tag/:tag' element={<PostList />} />
          <Route path='tag/:tag/:section' element={<PostList />} />
          <Route path='*' element={<Navigate to='tag/fresh' replace />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default Home;
