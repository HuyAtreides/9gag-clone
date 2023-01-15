import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Section from '../../models/section';
import { User } from '../../models/user';

export interface UserState {
  readonly isLoading: boolean;
  readonly profile: User | null;
  readonly errorMessage: string | null;
  readonly favoriteSections: readonly Section[];
}

const initialState: UserState = {
  /** isLoading is true because we always want to get user info when the app starts. */
  isLoading: true,
  profile: null,
  errorMessage: null,
  favoriteSections: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
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
} = userSlice.actions;
