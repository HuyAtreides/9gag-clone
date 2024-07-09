import { Spin, message } from 'antd';
import { useEffect } from 'react';
import './App.less';
import { useAppDispatch, useAppSelector } from './Store';
import { getAllSection } from './Store/section/section-dipatchers';
import { initUserProfile } from './Store/user/user-dipatchers';
import AuthContainer from './features/auth/AuthContainer';
import RootRoutes from './routes/RootRouter';
import {
  joinVideoCallSession,
  registerWebRTCEventHandler,
  startVideoCallSession,
} from './services/video-call-service';
import { WebSocketUtils } from './utils/web-socket-utils';
import VideoCall from './features/chat/video-call/VideoCall';
import { WebSocketEvent } from './models/enums/web-socket-event';
import CallerRinging from './features/chat/video-call/CallerRinging';
import CalleeRinging from './features/chat/video-call/CalleeRinging';
import {
  setCallEnded,
  setCalleeId,
  setCalleeImgUrl,
  setCalleeName,
  setCalleeVideoStream,
  setCallerVideoStream,
  setCalling,
  setOpenCallVideo,
  setReceiveCall,
} from './Store/video-call/video-call-slice';

function App() {
  const dispatch = useAppDispatch();
  const isGettingUser = useAppSelector((state) => state.user.isLoading);
  const user = useAppSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(getAllSection());
    dispatch(initUserProfile());
    registerWebRTCEventHandler();

    WebSocketUtils.registerEventHandler(
      WebSocketEvent.RECEIVE_CALL,
      (callerInfoAsString) => {
        const callerInfo = JSON.parse(callerInfoAsString);

        dispatch(setReceiveCall(true));
        dispatch(setCalleeId(callerInfo.id));
        dispatch(setCalleeImgUrl(callerInfo.imgUrl));
        dispatch(setCalleeName(callerInfo.name));
      },
    );

    WebSocketUtils.registerEventHandler(
      WebSocketEvent.ACCEPT_CALL,
      (acceptCallInfoAsString) => {
        const acceptCallInfo = JSON.parse(acceptCallInfoAsString);
        dispatch(setCalling(false));
        dispatch(setOpenCallVideo(true));

        startVideoCallSession(
          acceptCallInfo.callerId,
          acceptCallInfo.calleeId,
          (callerVideoStream) => dispatch(setCallerVideoStream(callerVideoStream)),
          (calleeVideoStream) => dispatch(setCalleeVideoStream(calleeVideoStream)),
          () => window.location.reload(),
        );
      },
    );

    WebSocketUtils.registerEventHandler(WebSocketEvent.CANCEL_CALL, () => {
      dispatch(setReceiveCall(false));
      message.info('Call has been canceled');
    });

    WebSocketUtils.registerEventHandler(WebSocketEvent.DENY_CALL, () => {
      dispatch(setCalling(false));
      message.info('Call has been denied');
    });

    WebSocketUtils.registerEventHandler(
      WebSocketEvent.VIDEO_OFFER,
      async (videoOfferAsString) => {
        dispatch(setOpenCallVideo(true));
        dispatch(setReceiveCall(false));

        joinVideoCallSession(
          videoOfferAsString,
          (callerVideoStream) => dispatch(setCallerVideoStream(callerVideoStream)),
          (calleeVideoStream) => dispatch(setCalleeVideoStream(calleeVideoStream)),
          () => {
            dispatch(setCallEnded(true));

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
        );
      },
    );
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
      <VideoCall />
      <CallerRinging />
      <CalleeRinging />
    </div>
  );
}

export default App;
