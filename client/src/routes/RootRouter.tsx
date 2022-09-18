import { useState } from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Home from "../features/Home";
import PostRoutes from "../features/post/PostRoutes";
import NavbarLayout from "../Layout/navbar-layout/NavbarLayout";

const { Header, Content } = Layout;

/** App routes. */
const RootRoutes: React.FC = () => {
    const [collapse, setCollapse] = useState<boolean>(false);

    return (
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 10, width: '100%', backgroundColor: 'transparent', padding: '0', top: 0}}>
                <NavbarLayout collapse={collapse} setCollapse={setCollapse}/>
            </Header>
            <Content>
                <Routes>
                    <Route path="/post" element={<PostRoutes />} />
                    <Route path="/*" element={<Home sideBarCollapse={collapse}/>}/>
                </Routes>
            </Content>
        </Layout>
    );
};

export default RootRoutes;
