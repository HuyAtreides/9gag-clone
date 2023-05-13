import { Button, Modal, Spin, Typography } from 'antd';
import { MouseEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store';
import {
  accept,
  decline,
  deleteRequest,
} from '../../Store/follow-request/follow-request-dispatchers';
import useTimeDiffFromToday from '../../custom-hooks/use-time-diff-from-today';
import { FollowRequestStatus } from '../../models/enums/follow-request-status';
import OwnerGuard from '../component-guard/OwnerGuard';
import UserProfilePreview from '../user-profile-preview/UserProfilePreview';
import UserSummary from '../user-summary/UserSummary';
import styles from './FollowRequest.module.scss';

const FollowRequest: React.FC<{ id: number }> = ({ id }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const requestState = useAppSelector((state) =>
    state.followRequest.requestStates.find(
      (requestState) => requestState.request.id === id,
    ),
  );
  const dispatch = useAppDispatch();
  const createdTimeDiffFromToday = useTimeDiffFromToday(
    requestState?.request.created || new Date(),
  );
  const [searchParams] = useSearchParams();
  const requestId = Number(searchParams.get('requestId'));

  if (!requestState) {
    return null;
  }

  const handleAcceptRequest = (event: MouseEvent) => {
    event.stopPropagation();
    setOpenPreview(false);
    dispatch(accept(id));
  };

  const handleDeclineRequest = (event: MouseEvent) => {
    event.stopPropagation();
    setOpenPreview(false);
    dispatch(decline(id));
  };

  const handleDeleteRequest = (event: MouseEvent) => {
    event.stopPropagation();
    setOpenPreview(false);
    dispatch(deleteRequest(id));
  };

  const { isProcessing, request } = requestState;
  const { sender, receiver } = request;
  const actions = [
    <Button type='primary' danger onClick={handleDeleteRequest}>
      Delete
    </Button>,
  ];

  if (request.status === FollowRequestStatus.PENDING) {
    actions.unshift(
      <OwnerGuard
        component={
          <>
            <Button type='primary' onClick={handleAcceptRequest}>
              Accept
            </Button>
            &nbsp; &nbsp;
            <Button type='default' onClick={handleDeclineRequest}>
              Decline
            </Button>
          </>
        }
        owner={receiver}
        replace={<Typography.Text type='secondary'>Pending</Typography.Text>}
      />,
    );
  } else {
    actions.unshift(
      <Typography.Text
        type={request.status === FollowRequestStatus.ACCEPTED ? 'success' : 'danger'}
      >
        {request.status === FollowRequestStatus.ACCEPTED ? 'Accepted' : 'Declined'}
      </Typography.Text>,
    );
  }

  return (
    <Spin spinning={isProcessing}>
      <Button
        type={requestId === id ? 'ghost' : 'text'}
        className={`${styles.followRequestButton}`}
        onClick={() => setOpenPreview(true)}
      >
        <OwnerGuard
          component={
            <UserSummary
              actions={actions}
              user={sender}
              description={
                <>
                  {sender.displayName} &#8226; {createdTimeDiffFromToday}
                </>
              }
            />
          }
          replace={
            <UserSummary
              actions={actions}
              user={receiver}
              description={
                <>
                  {receiver.displayName} &#8226; {createdTimeDiffFromToday}
                </>
              }
            />
          }
          owner={receiver}
        />
      </Button>
      <Modal
        centered
        className={styles.modal}
        visible={openPreview}
        onCancel={() => setOpenPreview(false)}
        destroyOnClose
        footer={
          <>
            <OwnerGuard
              component={
                request.status === FollowRequestStatus.PENDING ? (
                  <>
                    <Button type='primary' onClick={handleAcceptRequest}>
                      Accept
                    </Button>
                    <Button type='primary' danger onClick={handleDeclineRequest}>
                      Decline
                    </Button>
                  </>
                ) : (
                  <></>
                )
              }
              owner={receiver}
            />
            <Button type='text' onClick={() => setOpenPreview(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <OwnerGuard
          component={<UserProfilePreview userId={sender.id} />}
          replace={<UserProfilePreview userId={receiver.id} />}
          owner={receiver}
        />
      </Modal>
    </Spin>
  );
};

export default FollowRequest;
