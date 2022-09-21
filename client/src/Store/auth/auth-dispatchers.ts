import { AppDispatch, AppThunk } from '..';
import { Constant } from '../../models/enums/constant';
import RegisterData from '../../models/register-data';
import LoginData from '../../models/login-data';
import { UserSecret } from '../../models/user-secret';
import { registerUser, loginUser } from '../../services/auth-service';
import { LocalStorage } from '../../services/local-storage';
import { handleError } from '../../utils/error-handler';
import { getUser } from '../user/user-dipatchers';
import { setAuthErrorMessage, setIsLoading } from './auth-slice';
import { setProfile } from '../user/user-slice';

export const register =
    (registerData: RegisterData): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(setIsLoading(true));
            const userSecret = await registerUser(registerData);
            await processUserSecret(userSecret, dispatch);
            dispatch(setIsLoading(false));
        } catch (err: unknown) {
            handleError(dispatch, err, setAuthErrorMessage);
            dispatch(setIsLoading(false));
        }
    };

export const login =
    (loginData: LoginData): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(setIsLoading(true));
            const userSecret = await loginUser(loginData);
            await processUserSecret(userSecret, dispatch);
            dispatch(setIsLoading(false));
        } catch (err: unknown) {
            handleError(dispatch, err, setAuthErrorMessage);
            dispatch(setIsLoading(false));
        }
    };

export const logout = (): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(setIsLoading(true));
        LocalStorage.remove(Constant.TokenKey);
        dispatch(setProfile(null));
        dispatch(setIsLoading(false));
    } catch (err: unknown) {
        handleError(dispatch, err, setAuthErrorMessage);
        dispatch(setIsLoading(false));
    }
};

const processUserSecret = async (
    userSecret: UserSecret,
    dispatch: AppDispatch,
) => {
    LocalStorage.save(Constant.TokenKey, userSecret.token);
    await dispatch(getUser());
};
