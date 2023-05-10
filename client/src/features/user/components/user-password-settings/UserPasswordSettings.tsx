import { Button, Divider, Form, Input, Typography } from 'antd';
import styles from './UserPasswordSettings.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { setUserErrorMessage } from '../../../../Store/user/user-slice';
import { updatePassword } from '../../../../Store/user/user-dipatchers';

const UserPasswordSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector((state) => state.user.errorMessage);
  const isUpdating = useAppSelector((state) => state.user.isUpdating);
  useRenderErrorMessage(errorMessage, setUserErrorMessage);

  return (
    <Form
      layout='vertical'
      name='changePassword'
      disabled={isUpdating}
      onFinish={(values) => dispatch(updatePassword(values))}
    >
      <Typography.Title level={3}>Password</Typography.Title>
      <Divider />
      <Form.Item
        name='currentPassword'
        label={<strong>Current Password</strong>}
        rules={[
          {
            required: true,
            message: 'Please enter your current password',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name='newPassword'
        label={<strong>New Password</strong>}
        rules={[
          {
            required: true,
            message: 'Please enter your new password',
          },
          {
            pattern: /.{8}/,
            message: 'Password must be at least 8 characters long',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name='confirmNewPassword'
        label={<strong>Confirm New Password</strong>}
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
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' block loading={isUpdating}>
          Update Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserPasswordSettings;
