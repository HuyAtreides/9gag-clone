import {
  cancelRequest,
  followUserInSummaryList,
  sendRequest,
  unFollowUserInSummaryList,
} from '../../../../../Store/user-summary/user-summary-dispatcher';
import UserFollowButton from '../../../../../components/UserFollowButton/UserFollowButton';
import OwnerGuard from '../../../../../components/component-guard/OwnerGuard';
import UserSummary from '../../../../../components/user-summary/UserSummary';
import useFollow from '../../../../../custom-hooks/follow';
import useSendFollowRequest from '../../../../../custom-hooks/send-follow-request';
import { User } from '../../../../../models/user';

const UserFollowingSummary: React.FC<{ user: User }> = ({ user }) => {
  const follow = useFollow({
    isFollowed: user.followed,
    followThunkAction: followUserInSummaryList(user.id),
    unFollowThunkAction: unFollowUserInSummaryList(user.id),
  });
  const sendFollowRequest = useSendFollowRequest({
    receivedRequest: user.receivedFollowRequest,
    sendRequestThunkAction: sendRequest(user.id),
    cancelRequestThunkAction: cancelRequest(user.id),
  });

  return (
    <UserSummary
      actions={[
        <OwnerGuard
          component={<></>}
          replace={
            <UserFollowButton
              followUser={follow}
              sendRequest={sendFollowRequest}
              user={user}
            />
          }
          owner={user}
        />,
      ]}
      user={user}
    />
  );
};

export default UserFollowingSummary;
