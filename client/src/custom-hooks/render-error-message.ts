import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { message } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch } from '../Store';

const useRenderErrorMessage = (
  errorMessage: string | null,
  errorMessageCreator: ActionCreatorWithPayload<string | null>,
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
    }
    return () => {
      dispatch(errorMessageCreator(null));
    };
  }, [errorMessage, errorMessageCreator, dispatch]);
};

export default useRenderErrorMessage;
