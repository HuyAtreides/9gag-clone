import { Spin } from 'antd';
import { useEffect } from 'react';
import './App.less';
import { useAppDispatch, useAppSelector } from './Store';
import { getAllSection } from './Store/section/section-dipatchers';
import { initUserProfile } from './Store/user/user-dipatchers';
import AuthContainer from './features/auth/AuthContainer';
import RootRoutes from './routes/RootRouter';

function App() {
  const dispatch = useAppDispatch();
  const isGettingUser = useAppSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(getAllSection());
    dispatch(initUserProfile());
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
