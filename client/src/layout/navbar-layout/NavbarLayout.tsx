import { Button, Divider, Layout, PageHeader, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/app-header/AppHeader';

/** Common layout for other features. */
const NavbarLayout: React.FC = () => {
  return (
    <Layout>
      <AppHeader></AppHeader>
      <Sider theme='light' />
      {/* <Content>
        <Outlet />
      </Content> */}
    </Layout>
  );
};

export default NavbarLayout;
