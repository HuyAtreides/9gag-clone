import { ReactElement } from 'react';
import { useAppSelector } from '../../Store';

interface Props {
  component: ReactElement;
}

const AuthenticatedGuard: React.FC<Props> = ({ component }: Props) => {
  const user = useAppSelector((state) => state.user.profile);

  if (!user) {
    return null;
  }

  return component;
};

export default AuthenticatedGuard;
