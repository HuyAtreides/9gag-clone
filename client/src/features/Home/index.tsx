import React from "react";
import { Layout, Typography } from "antd";
import AuthContainer from "../auth/AuthContainer"
import Sidebar from "./Components/Sidebar";

const { Sider, Content } = Layout;

interface IHomeProp{
    sideBarCollapse: boolean;
}

const Home: React.FC<IHomeProp> = ({ sideBarCollapse }) => {
    return (
        <Layout>
            <Sider
                breakpoint="lg"
                collapsed={sideBarCollapse}
                collapsedWidth={0}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 50,
                    bottom: 0,
                }}
            >
                <Sidebar />
            </Sider>
            <Content style={{backgroundColor: 'transparent', marginLeft:'200px'}}>
                <Typography.Title>Content</Typography.Title>
                <AuthContainer />
            </Content>
        </Layout>
    );
};

export default Home;
