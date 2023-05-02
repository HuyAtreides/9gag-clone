import { Avatar, List } from 'antd';
import { Link } from 'react-router-dom';
import {
  cancelRequest,
  followUserInSummaryList,
  sendRequest,
  unFollowUserInSummaryList,
} from '../../../../../Store/user-summary/user-summary-dispatcher';
import UserFollowButton from '../../../../../components/UserFollowButton/UserFollowButton';
import OwnerGuard from '../../../../../components/component-guard/OwnerGuard';
import NameWithCountryFlag from '../../../../../components/name-with-country-flag/NameWithCountryFlag';
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
    <List.Item
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
    >
      <List.Item.Meta
        avatar={<Avatar src={user.avatarUrl} size={50} />}
        title={
          <Link to={`/user/${user.id}`}>
            <NameWithCountryFlag
              name={user.username}
              country={user.country || undefined}
            />
          </Link>
        }
        description={user.displayName}
      />
    </List.Item>
  );
};

export default UserFollowingSummary;
