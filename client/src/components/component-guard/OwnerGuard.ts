import { ReactElement } from 'react';
import { User } from '../../models/user';
import { useAppSelector } from '../../Store';

interface Props {
  component: ReactElement;
  owner: User;
}

const OwnerGuard: React.FC<Props> = ({ component, owner }: Props) => {
  const currentUser = useAppSelector((state) => state.user.profile);

  if (currentUser?.username !== owner.username) {
    return null;
  }

  return component;
};

export default OwnerGuard;
