import { useState } from 'react';
import { Layout } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../features/Home';
import PostRoutes from '../features/post/PostRoutes';
import NavbarLayout from '../layout/navbar-layout/NavbarLayout';

const { Content } = Layout;

/** App routes. */
const RootRoutes: React.FC = () => {
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <Layout>
      <NavbarLayout collapse={collapse} setCollapse={setCollapse} />
      <Content>
        <Routes>
          <Route path='/add-post' element={<PostRoutes />} />
          <Route path='/tag/:tag//*' element={<Home sideBarCollapse={collapse} />} />
          <Route
            path='/tag/:tag/:section//*'
            element={<Home sideBarCollapse={collapse} />}
          />
          <Route path='/post//*' element={<Home sideBarCollapse={collapse} />} />

          <Route path='/*' element={<Navigate to='tag/fresh' replace />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default RootRoutes;
