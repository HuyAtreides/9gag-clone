import { SendOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { User } from '../../models/user';

interface Props {
  readonly user: User;
  readonly followUser: () => void;
  readonly sendRequest: () => void;
  readonly hasIcon?: boolean;
}

const UserFollowButton: React.FC<Props> = ({
  user,
  followUser,
  hasIcon = false,
  sendRequest,
}) => {
  const { followed, receivedFollowRequest, isPrivate } = user;

  if (isPrivate && !followed) {
    return (
      <Button
        type={receivedFollowRequest ? 'primary' : 'text'}
        icon={hasIcon ? <SendOutlined /> : null}
        onClick={sendRequest}
      >
        {receivedFollowRequest ? 'Cancel Request' : 'Send Request'}
      </Button>
    );
  }

  return (
    <Button
      type={user?.followed ? 'primary' : 'text'}
      icon={hasIcon ? <UserAddOutlined /> : null}
      onClick={followUser}
    >
      {user?.followed ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default UserFollowButton;
