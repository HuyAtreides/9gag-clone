import { GoogleOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../Store';
import { signInWithGoogle } from '../../../../Store/auth/auth-dispatchers';
import { setAuthErrorMessage } from '../../../../Store/auth/auth-slice';
import styles from '../SocialSiginButton.module.scss';

const DEFAULT_GOOGLE_SIGN_IN_ERROR_MESSAGE =
  'Something wrong happened when try to sign in with Google. Please try again latter';

const LoginWithGoogleButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string | undefined>(undefined);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setCode(codeResponse.access_token),
    onError: (error) =>
      dispatch(
        setAuthErrorMessage(
          error.error_description || DEFAULT_GOOGLE_SIGN_IN_ERROR_MESSAGE,
        ),
      ),
  });

  useEffect(() => {
    if (code) {
      dispatch(signInWithGoogle(code));
    }
  }, [code, dispatch]);

  return (
    <Button
      onClick={() => login()}
      block
      size='large'
      shape='round'
      icon={<GoogleOutlined className={styles.googleSocialIcon} />}
      className={styles.socialSignInButton}
    >
      Log In With Google
    </Button>
  );
};

export default LoginWithGoogleButton;
