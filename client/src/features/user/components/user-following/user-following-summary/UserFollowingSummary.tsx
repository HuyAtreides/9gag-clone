import { Avatar, Button, List } from 'antd';
import { User } from '../../../../../models/user';
import useFollow from '../../../../../custom-hooks/follow';
import { followUserInSummaryList } from '../../../../../Store/user-summary/user-summary-dispatcher';
import NameWithCountryFlag from '../../../../../components/name-with-country-flag/NameWithCountryFlag';
import { Link } from 'react-router-dom';
import OwnerGuard from '../../../../../components/component-guard/OwnerGuard';

const UserFollowingSummary: React.FC<{ user: User }> = ({ user }) => {
  const follow = useFollow({
    isFollowed: user.followed,
    followThunkAction: followUserInSummaryList(user.id),
    unFollowThunkAction: followUserInSummaryList(user.id),
  });

  return (
    <List.Item
      actions={[
        <OwnerGuard
          component={<></>}
          replace={
            <Button type={user.followed ? 'default' : 'primary'} onClick={follow}>
              {user.followed ? 'Unfollow' : 'Follow'}
            </Button>
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
