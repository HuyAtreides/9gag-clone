import { ReactNode } from 'react';
import { User } from '../../models/user';
import { useAppSelector } from '../../Store';

interface Props {
  readonly replace?: ReactNode;
  readonly component: ReactNode;
  readonly user: User;
}

const PrivateProfileGuard: React.FC<Props> = ({ replace, component, user }) => {
  const currentUser = useAppSelector((state) => state.user.profile);

  if (currentUser?.id !== user.id && !user.followed && user.isPrivate) {
    return <>{replace}</>;
  }

  return <>{component}</>;
};

export default PrivateProfileGuard;
