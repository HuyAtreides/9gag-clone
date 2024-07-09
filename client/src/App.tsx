import { Spin } from 'antd';
import { useEffect } from 'react';
import './App.less';
import { useAppDispatch, useAppSelector } from './Store';
import { getAllSection } from './Store/section/section-dipatchers';
import { initUserProfile } from './Store/user/user-dipatchers';
import AuthContainer from './features/auth/AuthContainer';
import RootRoutes from './routes/RootRouter';
import { registerWebRTCEventHandler } from './services/video-call-service';
import { WebSocketUtils } from './utils/web-socket-utils';

function App() {
  const dispatch = useAppDispatch();
  const isGettingUser = useAppSelector((state) => state.user.isLoading);
  const user = useAppSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(getAllSection());
    dispatch(initUserProfile());

    registerWebRTCEventHandler();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      WebSocketUtils.connect(user.id);
    }
  }, [user]);

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
