import { Spin } from 'antd';
import { useEffect } from 'react';
import './App.less';
import RootRoutes from './routes/RootRouter';
import { useAppDispatch, useAppSelector } from './Store';
import { getUser } from './Store/user/user-dipatchers';

function App() {
  const dispatch = useAppDispatch();
  const isGettingUser = useAppSelector((state) => state.user.isLoading);

  /** Get user info when the app starts. */
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Spin size='large' spinning={isGettingUser}>
      <RootRoutes />
    </Spin>
  );
}

export default App;
