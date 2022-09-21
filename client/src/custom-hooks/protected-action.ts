import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../Store';
import { setIsProtectedActionInvoked } from '../Store/auth/auth-slice';

/** Protects actions from unauthenticated user.
 * @return a function to protect the action callback
 */
const useProtectedAction = () => {
    const user = useAppSelector((state) => state.user.profile);
    const dispatch = useAppDispatch();

    const protectAction = (
        callback: (...args: any[]) => any,
        ...callbackArgs: any[]
    ) => {
        return () => {
            if (user === null) {
                dispatch(setIsProtectedActionInvoked(true));
            } else {
                callback(...callbackArgs);
            }
        };
    };

    useEffect(() => {
        if (user) {
            dispatch(setIsProtectedActionInvoked(false));
        }
    }, [user, dispatch]);

    return protectAction;
};

export default useProtectedAction;
