import { message } from 'antd';
import { AppThunk } from '..';
import { Constant } from '../../models/enums/constant';
import Section from '../../models/section';
import UpdatePasswordData from '../../models/update-password-data';
import { UpdateProfileFormData } from '../../models/update-profile-form-data';
import { getUserInfo } from '../../services/auth-service';
import {
  cancelFollowRequest,
  sendFollowRequest,
} from '../../services/follow-request-service';
import { LocalStorage } from '../../services/local-storage';
import {
  addSectionToUserFavoriteSections,
  blockUser,
  followUser,
  getSpecificUserInfo,
  getUserFavoriteSections,
  getUserStats,
  removeSectionFromUserFavoriteSections,
  unFollowUser,
  updateUserPassword,
  updateUserProfile,
} from '../../services/user-service';
import { handleError } from '../../utils/error-handler';
import { getMediaLocationFromForm } from '../../utils/get-media-location-from-form';
import {
  addSectionToFavorite,
  removeSectionFromFavorite,
  resetOtherProfileState,
  setFavoriteSections,
  setIsGettingOtherProfile,
  setIsGettingUserStats,
  setIsLoading,
  setIsUpdating,
  setOtherProfile,
  setOtherProfileFollowed,
  setOtherProfileReceivedFollowRequest,
  setProfile,
  setUserErrorMessage,
  setUserStats,
} from './user-slice';

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

export const getStats =
  (userId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingUserStats(true));
      const userStats = await getUserStats(userId);
      dispatch(setUserStats(userStats));
      dispatch(setIsGettingUserStats(false));
    } catch (err: unknown) {
      handleError(dispatch, err, setUserErrorMessage);
      dispatch(setIsGettingUserStats(false));
    }
  };

export const getSpecificUser =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const currentUser = getState().user.profile!;

      if (currentUser.id === id) {
        return dispatch(setOtherProfile(currentUser));
      }

      dispatch(setIsGettingOtherProfile(true));
      const user = await getSpecificUserInfo(id);
      dispatch(setOtherProfile(user));
      dispatch(setIsGettingOtherProfile(false));
    } catch (err: unknown) {
      handleError(dispatch, err, setUserErrorMessage);
      dispatch(setIsGettingOtherProfile(false));
    }
  };

export const addSectionToUserFavorite =
  (section: Section): AppThunk =>
  async (dispatch, _) => {
    try {
      dispatch(addSectionToFavorite(section));
      await addSectionToUserFavoriteSections(section.id);
    } catch (err: unknown) {
      handleError(
        dispatch,
        "Can't add section for favorite. Please try again.",
        setUserErrorMessage,
      );
      dispatch(removeSectionFromFavorite(section));
    }
  };

export const removeSectionFromUserFavorite =
  (section: Section): AppThunk =>
  async (dispatch, _) => {
    try {
      dispatch(removeSectionFromFavorite(section));
      await removeSectionFromUserFavoriteSections(section.id);
    } catch (err: unknown) {
      handleError(
        dispatch,
        "Can't remove section for favorite. Please try again.",
        setUserErrorMessage,
      );
      dispatch(addSectionToFavorite(section));
    }
  };

export const getFavoriteSections = (): AppThunk => async (dispatch, _) => {
  try {
    const favoriteSections = await getUserFavoriteSections();
    dispatch(setFavoriteSections(favoriteSections));
  } catch (err: unknown) {
    handleError(
      dispatch,
      'Failed to get favorite sections. Please try again later.',
      setUserErrorMessage,
    );
  }
};

export const follow =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setOtherProfileFollowed(true));
      message.success('User followed!');
      await followUser(id);
    } catch (error: unknown) {
      dispatch(setOtherProfileFollowed(false));
      handleError(dispatch, error, setUserErrorMessage);
    }
  };

export const sendRequest =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setOtherProfileReceivedFollowRequest(true));
      message.success('Follow request sent!');
      await sendFollowRequest(id);
    } catch (error: unknown) {
      dispatch(setOtherProfileReceivedFollowRequest(false));
      handleError(dispatch, error, setUserErrorMessage);
    }
  };

export const cancelRequest =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setOtherProfileReceivedFollowRequest(false));
      message.info('Follow request canceled');
      await cancelFollowRequest(id);
    } catch (error: unknown) {
      dispatch(setOtherProfileReceivedFollowRequest(true));
      handleError(dispatch, error, setUserErrorMessage);
    }
  };

export const unFollow =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setOtherProfileFollowed(false));
      message.success('User un followed!');
      await unFollowUser(id);
    } catch (error: unknown) {
      dispatch(setOtherProfileFollowed(true));
      handleError(dispatch, error, setUserErrorMessage);
    }
  };

export const updateProfile =
  (updateProfileFormData: UpdateProfileFormData): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsUpdating(true));
      const avatarLocation = await getMediaLocationFromForm(updateProfileFormData.avatar);
      const coverImgLocation = await getMediaLocationFromForm(
        updateProfileFormData.coverImg,
      );
      const userSecret = await updateUserProfile({
        ...updateProfileFormData,
        avatarUrl:
          avatarLocation.url || (process.env.REACT_APP_DEFAULT_AVATAR_URL as string),
        coverImgUrl:
          coverImgLocation.url || (process.env.REACT_APP_DEFAULT_COVER_IMG_URL as string),
        country: updateProfileFormData.country || undefined,
      });
      LocalStorage.save(Constant.TokenKey, userSecret.token);
      dispatch(getUser());
      dispatch(setIsUpdating(false));
      message.success('Update profile successfully!');
    } catch (error: unknown) {
      dispatch(setIsUpdating(false));
      handleError(dispatch, error, setUserErrorMessage);
    }
  };

export const updatePassword =
  (updatePasswordData: UpdatePasswordData): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsUpdating(true));
      await updateUserPassword(updatePasswordData);
      dispatch(setIsUpdating(false));
      message.success('Update password successfully!');
    } catch (err: unknown) {
      dispatch(setIsUpdating(false));
      handleError(dispatch, err, setUserErrorMessage);
    }
  };

export const initUserProfile = (): AppThunk => (dispatch, _) => {
  try {
    const token = LocalStorage.get(Constant.TokenKey);

    if (token !== null) {
      dispatch(getFavoriteSections());
      dispatch(getUser());
    } else {
      dispatch(setIsLoading(false));
    }
  } catch (err: unknown) {
    handleError(dispatch, err, setUserErrorMessage);
    dispatch(setIsLoading(false));
  }
};

export const block =
  (userId: number): AppThunk =>
  async (dispatch, _) => {
    try {
      await blockUser(userId);
      dispatch(resetOtherProfileState());
    } catch (err: unknown) {
      handleError(dispatch, err, setUserErrorMessage);
    }
  };
