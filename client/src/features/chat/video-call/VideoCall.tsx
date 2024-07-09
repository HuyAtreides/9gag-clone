import { PhoneOutlined } from '@ant-design/icons';
import { Button, Empty, Modal } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import styles from './VideoCall.module.css';
import CenterSpinner from '../../../components/center-spinner/CenterSpinner';
import { useAppSelector } from '../../../Store';
import { hangUp } from '../../../services/video-call-service';

interface Props {
  readonly close: () => void;
  readonly callerVideoStream: MediaStream | null;
  readonly callEnded: boolean;
  readonly calleeVideoStream: MediaStream | null;
}

const VideoCall = () => {
  const calleeVideoStream = useAppSelector((state) => state.videoCall.calleeVideoStream);
  const openVideoCall = useAppSelector((state) => state.videoCall.openCallVideo);
  const callerVideoStream = useAppSelector((state) => state.videoCall.callerVideoStream);
  const callEnded = useAppSelector((state) => state.videoCall.callEnded);
  const calleeId = useAppSelector((state) => state.videoCall.calleeId);
  const callerVideoRef = useRef<HTMLVideoElement | null>(null);
  const calleeVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const callerVideo = callerVideoRef.current;

    if (callerVideo != null && callerVideoStream) {
      callerVideo.srcObject = callerVideoStream;
    }
  }, [callerVideoStream]);

  const endCall = useCallback(() => {
    hangUp(calleeId, () => window.location.reload());
  }, [calleeId]);

  const handleEndCall = () => {
    Modal.confirm({
      onOk: () => {
        endCall();
        return false;
      },
      title: 'Do you want to end this call?',
    });
  };

  // useEffect(() => {
  //   return () => endCall();
  // }, [endCall]);

  useEffect(() => {
    const calleeVideo = calleeVideoRef.current;

    if (calleeVideo != null && calleeVideoStream) {
      calleeVideo.srcObject = calleeVideoStream;
    }
  }, [calleeVideoStream]);

  return (
    <Modal
      visible={openVideoCall}
      className={styles.videoCallModal}
      destroyOnClose={false}
      cancelText
      closable={false}
      centered
      footer={
        <div>
          <Button danger icon={<PhoneOutlined />} type='primary' onClick={handleEndCall}>
            End call
          </Button>
        </div>
      }
    >
      {callEnded ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description='This Call has ended, this page will reload after 2 seconds'
        />
      ) : (
        <>
          {callerVideoStream ? (
            <video
              controls={false}
              ref={callerVideoRef}
              autoPlay
              className={styles.videoPanel}
            ></video>
          ) : (
            <CenterSpinner />
          )}
          {calleeVideoStream ? (
            <video
              controls={false}
              ref={calleeVideoRef}
              autoPlay
              className={styles.videoPanel}
            ></video>
          ) : null}
        </>
      )}
    </Modal>
  );
};

export default VideoCall;
