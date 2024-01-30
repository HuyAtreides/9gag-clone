import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/protected-route/ProtectedRoute';
import SideBarLayout from '../../layout/sidebar-layout/SidebarLayout';
import UserProfile from './pages/user-profile/UserProfile';
import UserSettings from './pages/user-settings/UserSettings';
import AffixAddConversationButton from '../../components/chat-conversations/AffixAddConversationButton';
import ChatBoxQueue from '../chat/components/ChatBoxQueue/ChatBoxQueue';

interface Props {
  readonly sideBarCollapse: boolean;
  readonly setSideBarCollapse: (collapse: boolean) => void;
}

const UserRoutes: React.FC<Props> = ({ sideBarCollapse, setSideBarCollapse }) => {
  return (
    <SideBarLayout
      sideBarCollapse={sideBarCollapse}
      setSideBarCollapse={setSideBarCollapse}
    >
      <Routes>
        <Route path=':id/:tab' element={<UserProfile />} />
        <Route path=':id' element={<UserProfile />} />
        <Route
          path='settings/:itemKey'
          element={<ProtectedRoute targetComponent={<UserSettings />} />}
        />
        <Route
          path='settings'
          element={<ProtectedRoute targetComponent={<UserSettings />} />}
        />
        <Route path='' element={<UserProfile />} />
      </Routes>
      <AffixAddConversationButton />
      <ChatBoxQueue />
    </SideBarLayout>
  );
};

export default UserRoutes;
