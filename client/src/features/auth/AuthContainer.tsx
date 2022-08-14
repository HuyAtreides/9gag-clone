import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React from 'react';
import Overlay from '../../components/overlay/Overlay';
import useRemoveErrorWhenUnmount from '../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../custom-hooks/render-error-message';
import { useAppSelector } from '../../Store';
import { setAuthErrorMessage } from '../../Store/auth/auth-slice';
import styles from './AuthContainer.module.css';
import Register from './pages/register/Register';

const AuthContainer: React.FC = () => {
  const authErrorMessage = useAppSelector((state) => state.auth.errorMessage);

  useRenderErrorMessage(authErrorMessage, setAuthErrorMessage);
  useRemoveErrorWhenUnmount(setAuthErrorMessage);

  return (
    <>
      <Overlay />
      <Row className={styles.row} align='middle' justify='center'>
        <Col span={10} flex='column' className={styles.formContainer}>
          <Button icon={<CloseOutlined />} type='text' className={styles.closeIcon} />
          <Register />
        </Col>
      </Row>
    </>
  );
};

export default AuthContainer;
