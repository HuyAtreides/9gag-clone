import { Spin } from 'antd';
import { useEffect } from 'react';
import RootRoutes from './routes/RootRouter';
import { useAppDispatch, useAppSelector } from './Store';
import { getFavoriteSections, getUser } from './Store/user/user-dipatchers';
import './App.less';
import AuthContainer from './features/auth/AuthContainer';
import { getAllSection } from './Store/section/section-dipatchers';

function App() {
  const dispatch = useAppDispatch();
  const isGettingUser = useAppSelector((state) => state.user.isLoading);

  /** Get user info when the app starts. */
  useEffect(() => {
    dispatch(getAllSection());
    dispatch(getFavoriteSections());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className='dark'>
      <Spin size='large' spinning={isGettingUser} className='entry-spinner'>
        <RootRoutes />
      </Spin>
      <AuthContainer />
    </div>
  );
}

export default App;
