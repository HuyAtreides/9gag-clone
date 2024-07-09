import { Avatar, Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../Store';
import { WebSocketUtils } from '../../../utils/web-socket-utils';
import { WebSocketEvent } from '../../../models/enums/web-socket-event';
import { setCalling } from '../../../Store/video-call/video-call-slice';
import styles from './VideoCall.module.css';

const CallerRinging = () => {
  const dispatch = useAppDispatch();
  const calling = useAppSelector((state) => state.videoCall.calling);
  const calleeImgUrl = useAppSelector((state) => state.videoCall.calleeImgUrl);
  const calleeId = useAppSelector((state) => state.videoCall.calleeId);

  const cancelCall = () => {
    dispatch(setCalling(false));

    WebSocketUtils.send({
      type: WebSocketEvent.CANCEL_CALL,
      targetUserId: calleeId,
    });
  };

  return (
    <Modal
      visible={calling}
      centered
      footer={
        <Button danger onClick={cancelCall}>
          Cancel
        </Button>
      }
      closable
      onCancel={cancelCall}
    >
      <div className={styles.ringing}>
        <Avatar src={calleeImgUrl} size={190} shape='circle' />

        <Typography.Paragraph strong className={styles.ringingText}>
          Calling...
        </Typography.Paragraph>
      </div>
    </Modal>
  );
};

export default CallerRinging;
