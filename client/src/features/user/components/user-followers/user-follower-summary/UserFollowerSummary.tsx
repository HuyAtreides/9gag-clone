import { Avatar, Button, List, Modal } from 'antd';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../../../Store';
import {
  cancelRequest,
  followUserInSummaryList,
  removeFollower,
  sendRequest,
  unFollowUserInSummaryList,
} from '../../../../../Store/user-summary/user-summary-dispatcher';
import UserFollowButton from '../../../../../components/UserFollowButton/UserFollowButton';
import OwnerGuard from '../../../../../components/component-guard/OwnerGuard';
import NameWithCountryFlag from '../../../../../components/name-with-country-flag/NameWithCountryFlag';
import useFollow from '../../../../../custom-hooks/follow';
import useSendFollowRequest from '../../../../../custom-hooks/send-follow-request';
import { User } from '../../../../../models/user';
import { UserProfileContext } from '../../../context/context';

interface Props {
  readonly user: User;
}

const UserFollowerSummary: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const currentUserProfile = useContext(UserProfileContext)!;
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
  const remove = () => {
    Modal.confirm({
      onOk: () => {
        dispatch(removeFollower(user.id));
        return false;
      },
      title: 'Do you want to remove this follower?',
    });
  };

  return (
    <List.Item
      actions={[
        <OwnerGuard
          component={
            <OwnerGuard
              component={<></>}
              replace={
                <Button type='primary' danger onClick={remove}>
                  Remove
                </Button>
              }
              owner={user}
            />
          }
          replace={
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
            />
          }
          owner={currentUserProfile}
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

export default UserFollowerSummary;
