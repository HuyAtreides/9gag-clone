import { AppThunk } from '..';
import Section from '../../models/section';
import { getUserInfo } from '../../services/auth-service';
import {
  addSectionToUserFavoriteSections,
  getSpecificUserInfo,
  getUserFavoriteSections,
  removeSectionFromUserFavoriteSections,
} from '../../services/user-service';
import { handleError } from '../../utils/error-handler';
import {
  addSectionToFavorite,
  removeSectionFromFavorite,
  setFavoriteSections,
  setIsGettingOtherProfile,
  setIsLoading,
  setOtherProfile,
  setProfile,
  setUserErrorMessage,
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
