import { ReactElement, ReactNode } from 'react';
import { useAppSelector } from '../../Store';

interface Props {
  component: ReactElement;
  replace?: ReactNode;
}

const AuthenticatedGuard: React.FC<Props> = ({ component, replace }) => {
  const user = useAppSelector((state) => state.user.profile);

  if (!user) {
    return <>{replace}</>;
  }

  return component;
};

export default AuthenticatedGuard;
