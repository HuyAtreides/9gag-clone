import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  errorMessage: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAuthErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setAuthErrorMessage, setIsLoading } = authSlice.actions;
