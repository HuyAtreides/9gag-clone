import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import axios from 'axios';
import React from 'react';
import { AppDispatch } from '../Store';
import { AppAction, AppActionCreator } from './types/app-action';

/** Handle error.
 * @param dispatch Redux dispatch function.
 * @param error App error.
 */
export function handleError(
  dispatch: AppDispatch | React.Dispatch<AppAction<any>>,
  error: unknown,
  errorActionCreator: ActionCreatorWithPayload<string | null> | AppActionCreator,
): void {
  if (axios.isAxiosError(error)) {
    /** Use the error message sent from server if there is one. */
    if (error.response && error.response.data) {
      dispatch(errorActionCreator((error.response.data as any).message));
    } else {
      dispatch(errorActionCreator(error.message));
    }
  } else if (error instanceof Error) {
    dispatch(errorActionCreator(error.message));
  } else if (typeof error === 'string') {
    dispatch(errorActionCreator(error));
  } else {
    dispatch(errorActionCreator('Something wrong happens please try again later.'));
  }
}
