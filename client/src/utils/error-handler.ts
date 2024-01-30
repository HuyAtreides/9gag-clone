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
  const errorMessage = extractErrorMessage(error);
  dispatch(errorActionCreator(errorMessage));
}

export function extractErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    /** Use the error message sent from server if there is one. */
    if (error.response && error.response.data) {
      return (error.response.data as any).message;
    } else {
      return error.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'Something wrong happens please try again later.';
  }
}
