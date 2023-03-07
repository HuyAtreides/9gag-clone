import { Route, Routes } from 'react-router-dom';
import SideBarLayout from '../../layout/sidebar-layout/SidebarLayout';
import UserProfile from './pages/user-profile/UserProfile';

interface Props {
  readonly sideBarCollapse: boolean;
}

const UserRoutes: React.FC<Props> = ({ sideBarCollapse }) => {
  return (
    <SideBarLayout sideBarCollapse={sideBarCollapse}>
      <Routes>
        <Route path=':id' element={<UserProfile />} />
        <Route path='' element={<UserProfile />} />
      </Routes>
    </SideBarLayout>
  );
};

export default UserRoutes;
