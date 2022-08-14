import { AppThunk } from '..';
import { getUserInfo } from '../../services/auth-service';
import { handleError } from '../../utils/error-handler';
import { setIsLoading, setUser, setUserErrorMessage } from './user-slice';

export const getUser = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setIsLoading(true));
    const user = await getUserInfo();
    dispatch(setUser(user));
    dispatch(setIsLoading(false));
  } catch (err: unknown) {
    handleError(dispatch, err, setUserErrorMessage);
    dispatch(setIsLoading(false));
  }
};
