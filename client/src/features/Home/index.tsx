import { Layout } from 'antd';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PostWithComment from './Components/post-with-comment/PostWithComment';
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

      {sideBarCollapse ? (
        <div className={styles['collapsed-spacer']}></div>
      ) : (
        <>
          <div className={styles.spacer}></div>
          <div className='overlay-background'></div>
        </>
      )}

      <Content className={styles.content}>
        <Routes>
          <Route path=':id' element={<PostWithComment />} />
          <Route path='' element={<PostList />} />
        </Routes>
      </Content>

      <div className={styles.rightSpacer}></div>
    </Layout>
  );
};

export default Home;
