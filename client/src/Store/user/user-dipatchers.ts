import { AppThunk } from '..';
import Section from '../../models/section';
import { getUserInfo } from '../../services/auth-service';
import {
  addSectionToUserFavoriteSections,
  removeSectionFromUserFavoriteSections,
} from '../../services/user-service';
import { handleError } from '../../utils/error-handler';
import {
  addSectionToFavorite,
  removeSectionFromFavorite,
  setIsLoading,
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
