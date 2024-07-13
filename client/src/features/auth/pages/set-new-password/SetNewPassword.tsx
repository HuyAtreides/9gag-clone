import { Button, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { resetPassword } from '../../../../Store/auth/auth-dispatchers';
import { setResetPasswordEmail } from '../../../../Store/auth/auth-slice';
import styles from '../../AuthContainer.module.scss';

interface Props {
  onNavigate: (state: string) => void;
}

const SetNewPassword = ({ onNavigate }: Props) => {
  const dispatch = useAppDispatch();
  const resetPasswordEmail = useAppSelector((state) => state.auth.resetPasswordEmail);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async ({
    newPassword,
    code,
  }: {
    newPassword: string;
    code: string;
  }) => {
    if (resetPasswordEmail == null) {
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(
        resetPassword({
          newPassword,
          code,
          email: resetPasswordEmail,
        }),
      );
    } catch (_) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    dispatch(setResetPasswordEmail(null));
    onNavigate('login');
    message.success('Reset password successfully');
  };

  return (
    <Form name='set-new-password' className={styles.formContainer} onFinish={onFinish}>
      <Typography.Title className={styles.title}>Set New Password</Typography.Title>

      <Form.Item
        name='newPassword'
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            pattern: /.{8}/,
            message: 'Password must be at least 8 characters long',
          },
        ]}
      >
        <Input.Password size='large' placeholder='Enter your new password' />
      </Form.Item>

      <Form.Item
        name='confirmNewPassword'
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two passwords that you entered do not match!'),
              );
            },
          }),
        ]}
      >
        <Input.Password size='large' placeholder='Confirm your password' />
      </Form.Item>

      <Form.Item
        name='code'
        rules={[{ required: true, message: 'Please input your code!' }]}
      >
        <Input size='large' placeholder='Enter your code' />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Button
          type='primary'
          htmlType='submit'
          loading={isLoading}
          className={styles.btn}
        >
          Reset Password
        </Button>

        <Typography.Text
          onClick={() => onNavigate('reset-password')}
          className={styles.navigateText}
        >
          Go Back
        </Typography.Text>
      </Form.Item>
    </Form>
  );
};

export default SetNewPassword;
