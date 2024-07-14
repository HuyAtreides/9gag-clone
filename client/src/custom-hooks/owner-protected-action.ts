import { useAppSelector } from '../Store';
import { User } from '../models/user';

const useOwnerProtectedAction = (resourceOwner?: User) => {
  const user = useAppSelector((state) => state.user.profile);

  const protectAction = (callback: (...args: any[]) => any, ...callbackArgs: any[]) => {
    return () => {
      if (resourceOwner && user && resourceOwner.equals(user)) {
        callback(...callbackArgs);
      }
    };
  };

  return protectAction;
};

export default useOwnerProtectedAction;
