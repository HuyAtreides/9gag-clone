import { Layout } from 'antd';
import Posts from './pages/posts/Posts';

const { Content } = Layout;

const PostRoutes: React.FC = () => {
    return (
        <Layout>
            <Content>
                <Posts />
            </Content>
        </Layout>
    );
};

export default PostRoutes;
