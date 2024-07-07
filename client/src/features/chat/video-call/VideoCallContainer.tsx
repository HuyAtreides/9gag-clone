import { useState } from 'react';
import VideoCall from './VideoCall';
import {
  requestMediaDevicesPermission,
  startVideoCallSession,
} from '../../../services/video-call-service';

interface Props {}

const VideoCallContainer = () => {
  // const [callerVideoStream, setCallerVideoStream] = useState<MediaStream | null>(null);
  // const [calleeVideoStream, setCalleeVideoStream] = useState<MediaStream | null>(null);
  // const [openVideoCall, setOpenVideoCall] = useState(false)
  // const assignVideoStream = (videoStream: MediaStream) => {
  //   setCallerVideoStream(videoStream);
  // };
  // const assignCalleeVideoStream = (videoStream: MediaStream) => {
  //   setCalleeVideoStream(videoStream);
  // };
  // const startVideoCall = async () => {
  //   setOpenVideoCall(true);
  //   const mediaStream = await requestMediaDevicesPermission();
  //   assignVideoStream(mediaStream);
  //   await startVideoCallSession(
  //     currentUser.id,
  //     chatParticipant.id,
  //     mediaStream,
  //     assignCalleeVideoStream,
  //   );
  // };
  // const endVideoCall = () => {}
  // return <VideoCall
  //   calleeVideoStream={calleeVideoStream}
  //   callerVideoStream={callerVideoStream}
  //   close={() => setOpenVideoCall(false)}
  // />
};

export default VideoCallContainer;
