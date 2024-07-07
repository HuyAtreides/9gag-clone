import { PhoneOutlined } from '@ant-design/icons';
import { Button, Empty, Modal } from 'antd';
import { useEffect, useRef } from 'react';
import styles from './VideoCall.module.css';
import CenterSpinner from '../../../components/center-spinner/CenterSpinner';

interface Props {
  readonly close: () => void;
  readonly callerVideoStream: MediaStream | null;
  readonly callEnded: boolean;
  readonly calleeVideoStream: MediaStream | null;
}

const VideoCall = ({ calleeVideoStream, callerVideoStream, close, callEnded }: Props) => {
  const callerVideoRef = useRef<HTMLVideoElement | null>(null);
  const calleeVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const callerVideo = callerVideoRef.current;

    if (callerVideo != null && callerVideoStream) {
      callerVideo.srcObject = callerVideoStream;
    }
  }, [callerVideoStream]);

  const handleEndCall = () => {
    Modal.confirm({
      onOk: () => {
        close();
        return false;
      },
      title: 'Do you want to end this call?',
    });
  };

  useEffect(() => {
    const calleeVideo = calleeVideoRef.current;

    if (calleeVideo != null && calleeVideoStream) {
      calleeVideo.srcObject = calleeVideoStream;
    }
  }, [calleeVideoStream]);

  return (
    <Modal
      visible
      width='50%'
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
