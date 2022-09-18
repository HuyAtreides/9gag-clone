import { useState } from 'react';
import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Home from '../features/Home';
import PostRoutes from '../features/post/PostRoutes';
import NavbarLayout from '../Layout/navbar-layout/NavbarLayout';

const { Header, Content } = Layout;

/** App routes. */
const RootRoutes: React.FC = () => {
    const [collapse, setCollapse] = useState<boolean>(false);

    return (
        <Layout>
            <NavbarLayout collapse={collapse} setCollapse={setCollapse} />
            <Content>
                <Routes>
                    <Route path="/post" element={<PostRoutes />} />
                    <Route
                        path="/*"
                        element={<Home sideBarCollapse={collapse} />}
                    />
                </Routes>
            </Content>
        </Layout>
    );
};

export default RootRoutes;
