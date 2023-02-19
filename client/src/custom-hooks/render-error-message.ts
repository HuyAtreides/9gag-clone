import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useAppDispatch } from '../Store';
import { AppAction, AppActionCreator } from '../utils/types/app-action';

/** Custom hook which helps render the error message. */
const useRenderErrorMessage = (
  errorMessage: string | null,
  errorMessageCreator: ActionCreatorWithPayload<string | null> | AppActionCreator,
  reactDispatch?: React.Dispatch<AppAction<any>>,
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
    }
    return () => {
      if (reactDispatch) {
        return reactDispatch(errorMessageCreator(null));
      }
      dispatch(errorMessageCreator(null));
    };
  }, [errorMessage, errorMessageCreator, dispatch, reactDispatch]);
};

export default useRenderErrorMessage;
