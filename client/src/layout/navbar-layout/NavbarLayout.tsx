import { Layout, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { Outlet } from 'react-router-dom';

/** Common layout for other features. */
const NavbarLayout: React.FC = () => {
  return (
    <Layout>
      <Header>
        <Typography.Title>NavbarLayout works!!!</Typography.Title>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default NavbarLayout;
