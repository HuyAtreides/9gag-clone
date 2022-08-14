import { Spin } from 'antd';
import { useEffect } from 'react';
import './App.less';
import RootRoutes from './routes/RootRouter';
import { useAppDispatch, useAppSelector } from './Store';
import { getUser } from './Store/user/user-dipatchers';

function App() {
  const dispatch = useAppDispatch();
  const isGettingUser = useAppSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (isGettingUser) {
    return <Spin size='large' />;
  }

  return (
    <>
      <RootRoutes />
    </>
  );
}

export default App;
