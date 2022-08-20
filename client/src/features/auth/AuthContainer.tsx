import { Modal, Typography } from 'antd';
import React from 'react';
import useRemoveErrorWhenUnmount from '../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../custom-hooks/render-error-message';
import { useAppDispatch, useAppSelector } from '../../Store';
import {
  setAuthErrorMessage,
  setIsProtectedActionInvoked,
} from '../../Store/auth/auth-slice';
import Register from './pages/register/Register';

/** Used by other features to display login or sign up form when an action
 * which requires authentication performed by unauthenticated user.
 * */
const AuthContainer: React.FC = () => {
  const authErrorMessage = useAppSelector((state) => state.auth.errorMessage);
  const dispatch = useAppDispatch();
  const isProtectedActionInvoked = useAppSelector(
    (state) => state.auth.isProtectedActionInvoked,
  );

  useRenderErrorMessage(authErrorMessage, setAuthErrorMessage);
  useRemoveErrorWhenUnmount(setAuthErrorMessage);

  const handleCancel = () => {
    dispatch(setIsProtectedActionInvoked(false));
  };

  return (
    <Modal
      title={<Typography.Title level={3}>Register</Typography.Title>}
      visible={isProtectedActionInvoked}
      onCancel={handleCancel}
      footer={null}
    >
      <Register />
    </Modal>
  );
};

export default AuthContainer;
