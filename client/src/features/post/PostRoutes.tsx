import { Route, Routes } from 'react-router-dom';
import Posts from './pages/posts/Posts';

const PostRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Posts />} />
    </Routes>
  );
};

export default PostRoutes;
