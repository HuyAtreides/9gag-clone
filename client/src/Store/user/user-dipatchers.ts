import { AppThunk } from '..';
import { getUserInfo } from '../../services/auth-service';
import { handleError } from '../../utils/error-handler';
import { setIsLoading, setProfile, setUserErrorMessage } from './user-slice';

export const getUser = (): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(setIsLoading(true));
        const user = await getUserInfo();
        dispatch(setProfile(user));
        dispatch(setIsLoading(false));
    } catch (err: unknown) {
        handleError(dispatch, err, setUserErrorMessage);
        dispatch(setIsLoading(false));
    }
};
