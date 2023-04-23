import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Section from '../../models/section';
import { User } from '../../models/user';
import { UserStats } from '../../models/user-stats';

export interface UserState {
  readonly isLoading: boolean;
  readonly profile: User | null;
  readonly errorMessage: string | null;
  readonly otherProfile: User | null;
  readonly isGettingOtherProfile: boolean;
  readonly isGettingUserStats: boolean;
  readonly stats: UserStats | null;
  readonly isUpdating: boolean;
  readonly favoriteSections: readonly Section[];
}

const initialState: UserState = {
  /** isLoading is true because we always want to get user info when the app starts. */
  isLoading: true,
  profile: null,
  isUpdating: false,
  errorMessage: null,
  otherProfile: null,
  isGettingOtherProfile: false,
  isGettingUserStats: false,
  stats: null,
  favoriteSections: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsUpdating(state, action: PayloadAction<boolean>) {
      state.isUpdating = action.payload;
    },
    setProfile(state, action: PayloadAction<User | null>) {
      state.profile = action.payload;
    },
    setUserErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
    addSectionToFavorite(state, action: PayloadAction<Section>) {
      state.favoriteSections.push(action.payload);
    },
    removeSectionFromFavorite(state, action: PayloadAction<Section>) {
      const currentFavoriteSections = state.favoriteSections;
      const removedSection = action.payload;
      state.favoriteSections = currentFavoriteSections!.filter(
        (section) => section.id !== removedSection.id,
      );
    },
    setFavoriteSections(state, action: PayloadAction<Section[]>) {
      state.favoriteSections = action.payload;
    },
    setOtherProfile(state, action: PayloadAction<User | null>) {
      state.otherProfile = action.payload;
    },
    setIsGettingOtherProfile(state, action: PayloadAction<boolean>) {
      state.isGettingOtherProfile = action.payload;
    },

    resetOtherProfileState(state, _: PayloadAction<void>) {
      state.isGettingOtherProfile = false;
      state.otherProfile = null;
    },

    setUserStats(state, action: PayloadAction<UserStats | null>) {
      state.stats = action.payload;
    },
    setIsGettingUserStats(state, action: PayloadAction<boolean>) {
      state.isGettingUserStats = action.payload;
    },
    setOtherProfileFollowed(state, action: PayloadAction<boolean>) {
      const otherProfile = state.otherProfile!;
      state.otherProfile = new User({
        ...otherProfile,
        followed: action.payload,
      });
    },
  },
});

export const userReducer = userSlice.reducer;
export const {
  setIsLoading,
  setProfile,
  setUserErrorMessage,
  addSectionToFavorite,
  removeSectionFromFavorite,
  setFavoriteSections,
  setOtherProfile,
  setIsGettingOtherProfile,
  resetOtherProfileState,
  setIsUpdating,
  setUserStats,
  setIsGettingUserStats,
  setOtherProfileFollowed,
} = userSlice.actions;
