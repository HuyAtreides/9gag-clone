import { Layout } from 'antd';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/protected-route/ProtectedRoute';
import Home from '../features/Home';
import PostRoutes from '../features/post/PostRoutes';
import UserRoutes from '../features/user/UserRoutes';
import NavbarLayout from '../layout/navbar-layout/NavbarLayout';
import { ScreenBreakPoint } from '../models/enums/constant';
import ChatRoutes from '../features/chat/pages/ChatRoutes';

const { Content } = Layout;

const IS_SMALLER_OR_EQUAL_TO_COLLAPSE_BREAK_POINT =
  window.innerWidth <= ScreenBreakPoint.Large;

/** App routes. */
const RootRoutes: React.FC = () => {
  const [collapse, setCollapse] = useState<boolean>(
    IS_SMALLER_OR_EQUAL_TO_COLLAPSE_BREAK_POINT,
  );

  return (
    <Layout>
      <NavbarLayout collapse={collapse} setCollapse={setCollapse} />
      <Content>
        <Routes>
          <Route
            path='/chat//*'
            element={<ProtectedRoute targetComponent={<ChatRoutes />} />}
          />
          <Route
            path='/add-post'
            element={<ProtectedRoute targetComponent={<PostRoutes />} />}
          />
          <Route
            path='/tag/:tag/:section//*'
            element={<Home sideBarCollapse={collapse} setSideBarCollapse={setCollapse} />}
          />
          <Route
            path='/tag/:tag//*'
            element={<Home sideBarCollapse={collapse} setSideBarCollapse={setCollapse} />}
          />
          <Route
            path='/post//*'
            element={<Home sideBarCollapse={collapse} setSideBarCollapse={setCollapse} />}
          />
          <Route
            path='/user//*'
            element={
              <ProtectedRoute
                targetComponent={
                  <UserRoutes
                    sideBarCollapse={collapse}
                    setSideBarCollapse={setCollapse}
                  />
                }
              />
            }
          />
          <Route path='/*' element={<Navigate to='tag/fresh' replace />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default RootRoutes;
