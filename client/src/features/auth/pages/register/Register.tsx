import { Button, Form, Input } from 'antd';
import React from 'react';
import RegisterData from '../../../../models/register-data';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { register } from '../../../../Store/auth/auth-dispatchers';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const onFinish = (registerData: RegisterData) => {
    dispatch(register(registerData));
  };

  return (
    <Form name='basic' onFinish={onFinish}>
      <Form.Item
        name='username'
        rules={[
          { required: true, message: 'Please input your username!' },
          {
            pattern: /^[a-zA-Z_0-9-]{1,20}$/,
            message:
              'Username should contain only numbers, alphabet letters, _, - and has at most 20 characters',
          },
        ]}
      >
        <Input placeholder='Enter your username' />
      </Form.Item>

      <Form.Item
        name='displayName'
        rules={[{ required: true, message: 'Please input your display name!' }]}
      >
        <Input placeholder='Enter your display name' />
      </Form.Item>

      <Form.Item
        name='password'
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            pattern: /.{8}/,
            message: 'Password must be at least 8 characters long',
          },
        ]}
      >
        <Input.Password placeholder='Enter your password' />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Button
          type='primary'
          htmlType='submit'
          loading={isLoading}
          className='full-width-btn'
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
