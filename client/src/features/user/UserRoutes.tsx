import { Route, Routes } from 'react-router-dom';
import SideBarLayout from '../../layout/sidebar-layout/SidebarLayout';
import UserProfile from './pages/user-profile/UserProfile';

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
        <Route path=':id' element={<UserProfile />} />
        <Route path='' element={<UserProfile />} />
      </Routes>
    </SideBarLayout>
  );
};

export default UserRoutes;
