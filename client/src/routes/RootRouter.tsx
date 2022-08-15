import { Route, Routes } from 'react-router-dom';
import PostRoutes from '../features/post/PostRoutes';
import NavbarLayout from '../layout/navbar-layout/NavbarLayout';

/** App routes. */
const RootRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/*' element={<NavbarLayout />}>
        <Route path='/*' element={<PostRoutes />} />
      </Route>
    </Routes>
  );
};

export default RootRoutes;
