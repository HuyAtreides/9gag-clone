import { Avatar, Button, List, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../../../Store';
import { removeFollower } from '../../../../../Store/user-summary/user-summary-dispatcher';
import NameWithCountryFlag from '../../../../../components/name-with-country-flag/NameWithCountryFlag';
import { User } from '../../../../../models/user';
import OwnerGuard from '../../../../../components/component-guard/OwnerGuard';

interface Props {
  readonly user: User;
}

const UserFollowerSummary: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
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

export default UserFollowerSummary;
