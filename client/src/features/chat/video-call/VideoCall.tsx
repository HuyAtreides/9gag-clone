import { Modal } from 'antd';
import { useEffect, useRef } from 'react';

interface Props {
  readonly close: () => void;
  readonly callerVideoStream: MediaStream | null;
  readonly calleeVideoStream: MediaStream | null;
}

const VideoCall = ({ calleeVideoStream, callerVideoStream, close }: Props) => {
  const callerVideoRef = useRef<HTMLVideoElement | null>(null);
  const calleeVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (callerVideoRef.current != null) {
      callerVideoRef.current.srcObject = callerVideoStream;
    }
  }, [callerVideoStream]);

  useEffect(() => {
    if (calleeVideoRef.current != null) {
      calleeVideoRef.current.srcObject = calleeVideoStream;
    }
  }, [calleeVideoStream]);

  return (
    <Modal onCancel={close} visible width={950} cancelText>
      <video controls={false} ref={callerVideoRef} autoPlay></video>

      <video controls={false} ref={calleeVideoRef} autoPlay></video>
    </Modal>
  );
};

export default VideoCall;
