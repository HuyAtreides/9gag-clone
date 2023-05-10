import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../Store';

interface Props {
  targetComponent: ReactNode;
}

/** Protects the targetComponent from unauthenticated user. */
const ProtectedRoute: React.FC<Props> = ({ targetComponent }: Props) => {
  const user = useAppSelector((state) => state.user.profile);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  if (!user && !isLoading) {
    return <Navigate to='/' />;
  }

  return <>{targetComponent}</>;
};

export default ProtectedRoute;
