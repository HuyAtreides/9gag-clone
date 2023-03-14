import { ReactElement, ReactNode } from 'react';
import { User } from '../../models/user';
import { useAppSelector } from '../../Store';

interface Props {
  component: ReactElement;
  owner: User;
  replace?: ReactNode;
}

const OwnerGuard: React.FC<Props> = ({ component, owner, replace }: Props) => {
  const currentUser = useAppSelector((state) => state.user.profile);

  if (currentUser?.username !== owner.username) {
    return <>{replace}</>;
  }

  return component;
};

export default OwnerGuard;
