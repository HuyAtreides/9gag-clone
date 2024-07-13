import { Button, Form, Input, Typography } from 'antd';
import styles from '../../AuthContainer.module.scss';
import { useState } from 'react';
import { useAppDispatch } from '../../../../Store';
import { setResetPasswordEmail } from '../../../../Store/auth/auth-slice';
import { generateResetPasswordCode } from '../../../../Store/auth/auth-dispatchers';

interface Props {
  onNavigate: (state: string) => void;
}

const ResetPassword = ({ onNavigate }: Props) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async ({ email }: { email: string }) => {
    dispatch(setResetPasswordEmail(email));
    setIsLoading(true);

    try {
      await dispatch(generateResetPasswordCode(email));
    } catch (_) {
      setIsLoading(false);
      return;
    }

    onNavigate('set-new-password');
  };

  return (
    <Form name='reset-password' className={styles.formContainer} onFinish={onFinish}>
      <Typography.Title className={styles.title}>Reset Password</Typography.Title>
      <Form.Item
        name='email'
        rules={[
          { required: true, message: 'Please input your email!' },
          {
            type: 'email',
            message: 'Not a valid email',
          },
        ]}
      >
        <Input size='large' placeholder='Enter your email' disabled={isLoading} />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Button
          type='primary'
          htmlType='submit'
          loading={isLoading}
          className={styles.btn}
        >
          Send Reset Password Code
        </Button>

        <Typography.Text
          onClick={() => onNavigate('login')}
          className={styles.navigateText}
        >
          Go Back To Login
        </Typography.Text>
      </Form.Item>
    </Form>
  );
};

export default ResetPassword;
