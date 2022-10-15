import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { ActionsFromAsyncThunk, AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';

export type ActionCreator<P> =
  | ActionCreatorWithPayload<P>
  | ActionsFromAsyncThunk<AnyAsyncThunk>;
