import { FacebookOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styles from '../SocialSiginButton.module.scss';

import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAppDispatch } from '../../../../Store';
import { signInWithFacebook } from '../../../../Store/auth/auth-dispatchers';
import { setAuthErrorMessage } from '../../../../Store/auth/auth-slice';

const DEFAULT_FACEBOOK_SIGN_IN_ERROR_MESSAGE =
  'Something wrong happened when try to sign in with Facebook. Please try again latter';

const LoginWithFacebookButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const login = (response: ReactFacebookLoginInfo) => {
    if (!response.accessToken) {
      dispatch(setAuthErrorMessage(DEFAULT_FACEBOOK_SIGN_IN_ERROR_MESSAGE));
    }
    dispatch(signInWithFacebook(response.accessToken));
  };

  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_API_ID as string}
      autoLoad={false}
      callback={login}
      render={(renderProps) => (
        <Button
          block
          size='large'
          shape='round'
          icon={<FacebookOutlined className={styles.facebookSocialIcon} />}
          className={styles.socialSignInButton}
          onClick={renderProps.onClick}
        >
          Log In with Facebook
        </Button>
      )}
    />
  );
};

export default LoginWithFacebookButton;
