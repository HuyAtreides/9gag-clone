import { Avatar, List } from 'antd';
import { User } from '../../models/user';
import { Link } from 'react-router-dom';
import NameWithCountryFlag from '../name-with-country-flag/NameWithCountryFlag';
import { ReactNode } from 'react';

interface Props {
  readonly actions: ReactNode[];
  readonly user: User;
}

const UserSummary: React.FC<Props> = ({ user, actions }) => {
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<Avatar src={user.avatarUrl} />}
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

export default UserSummary;
