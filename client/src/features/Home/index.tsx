import React from 'react';
import { Layout, Typography } from 'antd';
import AuthContainer from '../auth/AuthContainer';
import Sidebar from './Components/Sidebar';
import styles from './Home.module.scss';

const { Sider, Content } = Layout;

interface IHomeProp {
    sideBarCollapse: boolean;
}

const Home: React.FC<IHomeProp> = ({ sideBarCollapse }) => {
    return (
        <Layout className={styles.home}>
            <Sider
                breakpoint="lg"
                collapsed={sideBarCollapse}
                collapsedWidth={0}
                className={styles.sidebar}
            >
                <Sidebar />
            </Sider>
            <Content>
                <div className={styles.content}>
                    <Typography.Title>Content</Typography.Title>
                    <AuthContainer />
                </div>
            </Content>
        </Layout>
    );
};

export default Home;
