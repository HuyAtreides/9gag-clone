import { GoogleOAuthProvider } from '@react-oauth/google';
import { Divider, Modal, Spin } from 'antd';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Store';
import {
  setAuthErrorMessage,
  setIsProtectedActionInvoked,
} from '../../Store/auth/auth-slice';
import CenterSpinner from '../../components/center-spinner/CenterSpinner';
import useRemoveErrorWhenUnmount from '../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../custom-hooks/render-error-message';
import LoginWithGoogleButton from './components/LoginInWithGoogleButton/LoginWithGoogleButton';
import LoginWithFacebookButton from './components/LoginWithFacebookButton/LoginWithFacebookButton';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ResetPassword from './pages/reset-password/ResetPassword';
import SetNewPassword from './pages/set-new-password/SetNewPassword';

/** Used by other features to display login or sign up form when an action
 * which requires authentication performed by unauthenticated user.
 * */
const AuthContainer: React.FC = () => {
  const [state, setState] = useState<string>('register');
  const authErrorMessage = useAppSelector((state) => state.auth.errorMessage);
  const dispatch = useAppDispatch();
  const isProtectedActionInvoked = useAppSelector(
    (state) => state.auth.isProtectedActionInvoked,
  );
  const isSocialSignIn = useAppSelector((state) => state.auth.isSocialSignIn);

  useRenderErrorMessage(authErrorMessage, setAuthErrorMessage);
  useRemoveErrorWhenUnmount(setAuthErrorMessage);

  const handleCancel = () => {
    dispatch(setIsProtectedActionInvoked(false));
  };

  return (
    <Modal
      centered
      visible={isProtectedActionInvoked}
      onCancel={handleCancel}
      footer={null}
    >
      <Spin indicator={<CenterSpinner />} spinning={isSocialSignIn}>
        {state === 'register' ? (
          <Register onNavigate={setState} />
        ) : state === 'forget-password' ? (
          <ResetPassword onNavigate={setState} />
        ) : state === 'set-new-password' ? (
          <SetNewPassword onNavigate={setState} />
        ) : (
          <Login onNavigate={setState} />
        )}

        <Divider plain>Or Login With</Divider>

        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_ID as string}>
          <LoginWithGoogleButton />
        </GoogleOAuthProvider>
        <br />
        <LoginWithFacebookButton />
      </Spin>
    </Modal>
  );
};

export default AuthContainer;
