import { Avatar, Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../Store';
import {
  setConnecting,
  setReceiveCall,
} from '../../../Store/video-call/video-call-slice';
import { WebSocketEvent } from '../../../models/enums/web-socket-event';
import { WebSocketUtils } from '../../../utils/web-socket-utils';
import styles from './VideoCall.module.css';

const CalleeRinging = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile!);
  const receiveCall = useAppSelector((state) => state.videoCall.receiveCall);
  const calleeImgUrl = useAppSelector((state) => state.videoCall.calleeImgUrl);
  const calleeName = useAppSelector((state) => state.videoCall.calleeName);
  const calleeId = useAppSelector((state) => state.videoCall.calleeId);
  const connecting = useAppSelector((state) => state.videoCall.connecting);

  const accept = () => {
    WebSocketUtils.send({
      type: WebSocketEvent.ACCEPT_CALL,
      calleeId: user.id,
      callerId: calleeId,
      targetUserId: calleeId,
    });

    dispatch(setConnecting(true));
  };

  const deny = () => {
    dispatch(setReceiveCall(false));

    WebSocketUtils.send({
      type: WebSocketEvent.DENY_CALL,
      targetUserId: calleeId,
    });
  };

  return (
    <Modal visible={receiveCall} closable onCancel={deny} footer={null} centered>
      <div className={styles.ringing}>
        <Avatar src={calleeImgUrl} size={190} shape='circle' />

        {connecting ? (
          <Typography.Paragraph strong className={styles.ringingText}>
            Connecting...
          </Typography.Paragraph>
        ) : (
          <>
            <Typography.Paragraph strong className={styles.ringingText}>
              {calleeName} is calling...
            </Typography.Paragraph>

            <div className={styles.buttonContainer}>
              <Button type='primary' onClick={accept}>
                Accept
              </Button>

              <Button type='primary' danger onClick={deny}>
                Deny
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CalleeRinging;
