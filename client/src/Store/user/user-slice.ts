import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/user";

export interface UserState {
  readonly isLoading: boolean,
  readonly user: User | null,
  readonly errorMessage: string | null,
}

const initialState: UserState = {

  /** isLoading is true because we always want to get user info when the app starts. */
  isLoading: true,
  user: null,
  errorMessage: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setUserErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  }
})

export const userReducer = userSlice.reducer
export const {setIsLoading, setUser, setUserErrorMessage} = userSlice.actions