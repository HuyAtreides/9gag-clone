import { AppDispatch, AppThunk } from '..';
import { Constant } from '../../models/enums/constant';
import RegisterData from '../../models/register-data';
import LoginData from '../../models/login-data';
import { UserSecret } from '../../models/user-secret';
import {
  registerUser,
  loginUser,
  loginUserWithSocialSignIn,
  generateCode,
  sendResetPasswordRequest,
} from '../../services/auth-service';
import { LocalStorage } from '../../services/local-storage';
import { handleError } from '../../utils/error-handler';
import { getUser } from '../user/user-dipatchers';
import { setAuthErrorMessage, setIsLoading, setIsSocialSignIn } from './auth-slice';
import { setFavoriteSections, setProfile } from '../user/user-slice';
import SocialLoginData from '../../models/social-login-data';
import { getGoogleUserProfile } from '../../services/google-user-profile-service';
import { getFacebookUserProfile } from '../../services/facebook-user-profile-service';
import { message } from 'antd';
import { ResetPasswordData } from '../../models/reset-password-data';

type FetchSocialProfileFunc = (accessCode: string) => Promise<SocialLoginData>;

export const socialSignIn =
  (accessCode: string, fetchSocialProfileFunc: FetchSocialProfileFunc): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsSocialSignIn(true));
      const profile = await fetchSocialProfileFunc(accessCode);
      const userSecret = await loginUserWithSocialSignIn(profile);
      await processUserSecret(userSecret, dispatch);
      dispatch(setIsSocialSignIn(false));
    } catch (err: unknown) {
      handleError(dispatch, err, setAuthErrorMessage);
      dispatch(setIsSocialSignIn(false));
    }
  };

export const signInWithGoogle = (accessCode: string) => {
  return socialSignIn(accessCode, getGoogleUserProfile);
};

export const signInWithFacebook = (accessCode: string) => {
  return socialSignIn(accessCode, getFacebookUserProfile);
};

export const resetPassword =
  (resetPasswordData: ResetPasswordData): AppThunk =>
  async (dispatch, _) => {
    try {
      await sendResetPasswordRequest(resetPasswordData);
    } catch (error: unknown) {
      handleError(dispatch, error, setAuthErrorMessage);

      throw new Error();
    }
  };

export const generateResetPasswordCode =
  (email: string): AppThunk =>
  async () => {
    try {
      await generateCode(email);
    } catch (_) {
      message.error('Failed to send email, please try again');
      throw new Error();
    }
  };

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
    dispatch(setFavoriteSections([]));
    dispatch(setIsLoading(false));
  } catch (err: unknown) {
    handleError(dispatch, err, setAuthErrorMessage);
    dispatch(setIsLoading(false));
  }
};

const processUserSecret = async (userSecret: UserSecret, dispatch: AppDispatch) => {
  LocalStorage.save(Constant.TokenKey, userSecret.token);
  await dispatch(getUser());
};
