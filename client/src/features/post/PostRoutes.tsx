import { Layout } from 'antd';
import Posts from './pages/posts/Posts';
import ChatBoxQueue from '../chat/components/ChatBoxQueue/ChatBoxQueue';
import AffixAddConversationButton from '../../components/chat-conversations/AffixAddConversationButton';

const { Content } = Layout;

const PostRoutes: React.FC = () => {
  return (
    <Layout>
      <Content>
        <Posts />
      </Content>
      <AffixAddConversationButton />
      <ChatBoxQueue />
    </Layout>
  );
};

export default PostRoutes;
