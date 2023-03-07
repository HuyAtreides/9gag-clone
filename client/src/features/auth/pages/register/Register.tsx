import { Button, Form, Input, Select, Typography } from 'antd';
import { Option } from 'antd/lib/mentions';
import React from 'react';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import { getCountryListOptions } from '../../../../models/enums/country';
import RegisterData from '../../../../models/register-data';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { register } from '../../../../Store/auth/auth-dispatchers';
import styles from '../../AuthContainer.module.scss';

interface IRegister {
  onNavigate: (state: string) => void;
}

const Register: React.FC<IRegister> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const onFinish = (registerData: RegisterData) => {
    dispatch(register(registerData));
  };

  return (
    <Form name='register' className={styles.formContainer} onFinish={onFinish}>
      <Typography.Title className={styles.title}>Register</Typography.Title>
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
        <Input size='large' placeholder='Enter your username' />
      </Form.Item>

      <Form.Item
        name='displayName'
        rules={[
          {
            required: true,
            message: 'Please input your display name!',
          },
        ]}
      >
        <Input size='large' placeholder='Enter your display name' />
      </Form.Item>

      <Form.Item name='country'>
        <Select placeholder='Select your country' size='large'>
          {getCountryListOptions().map((option) => (
            <Option value={option.value}>
              <NameWithCountryFlag name={option.label} country={option.value} />
            </Option>
          ))}
        </Select>
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
        <Input.Password size='large' placeholder='Enter your password' />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Button
          type='primary'
          htmlType='submit'
          loading={isLoading}
          className={styles.btn}
        >
          Submit
        </Button>
        <Typography.Text
          onClick={() => onNavigate('login')}
          className={styles.navigateText}
        >
          Already a member? Log in
        </Typography.Text>
      </Form.Item>
    </Form>
  );
};

export default Register;
