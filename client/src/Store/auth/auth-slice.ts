import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  readonly isLoading: boolean;
  readonly isProtectedActionInvoked: boolean;
  readonly errorMessage: string | null;
  readonly isSocialSignIn: boolean;
  readonly resetPasswordEmail: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  isProtectedActionInvoked: false,
  errorMessage: null,
  resetPasswordEmail: null,
  isSocialSignIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setResetPasswordEmail(state, action: PayloadAction<string | null>) {
      state.resetPasswordEmail = action.payload;
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAuthErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
    setIsProtectedActionInvoked(state, action: PayloadAction<boolean>) {
      state.isProtectedActionInvoked = action.payload;
    },
    setIsSocialSignIn(state, action: PayloadAction<boolean>) {
      state.isSocialSignIn = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const {
  setAuthErrorMessage,
  setIsLoading,
  setIsProtectedActionInvoked,
  setIsSocialSignIn,
  setResetPasswordEmail,
} = authSlice.actions;
