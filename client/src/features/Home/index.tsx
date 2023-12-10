import { Divider } from 'antd';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatConversations from '../../components/chat-conversations/ChatConversations';
import AuthenticatedGuard from '../../components/component-guard/AuthenticatedGuard';
import UserSearch from '../../components/user-search/UserSearch';
import SideBarLayout from '../../layout/sidebar-layout/SidebarLayout';
import PostWithComment from './Components/post-with-comment/PostWithComment';
import styles from './Home.module.scss';
import PostList from './pages/post-list/PostList';
import AffixAddConversationButton from '../../components/chat-conversations/AffixAddConversationButton';
import ChatBoxQueue from '../chat/components/ChatBoxQueue/ChatBoxQueue';

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
        <div className={styles.rightHandSideContent}>
          <AuthenticatedGuard component={<UserSearch />} />
          <AuthenticatedGuard
            component={
              <>
                <Divider />
                <ChatConversations />
              </>
            }
          />
        </div>
      </div>
      <AffixAddConversationButton />
      <ChatBoxQueue />
    </SideBarLayout>
  );
};

export default Home;
