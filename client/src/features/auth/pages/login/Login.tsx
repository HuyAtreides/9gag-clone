import { Button, Form, Input, Typography } from 'antd';
import React from 'react';
import LoginData from '../../../../models/login-data';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { login } from '../../../../Store/auth/auth-dispatchers';
import styles from '../../AuthContainer.module.scss';

interface ILogin {
    onNavigate: (state: string) => void;
}

const Login: React.FC<ILogin> = ({ onNavigate }) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.auth.isLoading);

    const onFinish = (loginData: LoginData) => {
        dispatch(login(loginData));
    };

    return (
        <Form
            name="register"
            className={styles.formContainer}
            onFinish={onFinish}
        >
            <Typography.Title className={styles.title}>Login</Typography.Title>
            <Form.Item
                name="username"
                rules={[
                    { required: true, message: 'Please input your username!' },
                ]}
            >
                <Input size="large" placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Please input your password!' },
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Enter your password"
                />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    className={styles.btn}
                >
                    Submit
                </Button>
                <Typography.Text
                    onClick={() => onNavigate('register')}
                    className={styles.navigateText}
                >
                    Haven't a member? Register
                </Typography.Text>
            </Form.Item>
        </Form>
    );
};

export default Login;
