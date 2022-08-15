import { Col, Row, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

/** Common layout for other features. */
const NavbarLayout: React.FC = () => {
  return (
    <Row>
      <Col>
        <Typography.Title>NavbarLayout works!!!</Typography.Title>
        <Outlet />
      </Col>
    </Row>
  );
};

export default NavbarLayout;
