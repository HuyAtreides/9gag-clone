import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../Store';

interface Props {
  targetComponent: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ targetComponent }: Props) => {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to='/' />;
  }

  return <>{targetComponent}</>;
};

export default ProtectedRoute;
