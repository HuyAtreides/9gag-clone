import { Button, Form, Input, Typography } from 'antd';
import React from 'react';
import RegisterData from '../../../../models/register-data';
import { register } from '../../../../Store/auth/auth-dispatchers';
import { useAppDispatch, useAppSelector } from '../../../../Store';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const onFinish = (registerData: RegisterData) => {
    dispatch(register(registerData));
  };

  return (
    <>
      <Typography.Title level={3} className='center-text'>
        Register
      </Typography.Title>
      <Form name='basic' onFinish={onFinish}>
        <Form.Item
          name='username'
          rules={[{ required: true, message: 'Please input your username!' }]}
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
    </>
  );
};

export default Register;
