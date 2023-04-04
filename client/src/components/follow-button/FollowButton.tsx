import { NotificationFilled, NotificationOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useProtectedAction from '../../custom-hooks/protected-action';

interface Props {
  readonly followed: boolean;
  readonly handleFollow: () => void;
}

const FollowButton: React.FC<Props> = ({ followed, handleFollow }) => {
  const protectAction = useProtectedAction();

  return (
    <Button
      type='text'
      className='full-width-btn'
      icon={followed ? <NotificationFilled /> : <NotificationOutlined />}
      onClick={protectAction(handleFollow)}
    >
      {followed ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
