import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { message } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch } from '../Store';

/** Custom hook which helps render the error message. */
const useRenderSuccessMessage = (
  successMessage: string | null,
  errorMessageCreator: ActionCreatorWithPayload<string | null>,
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
    }
    return () => {
      dispatch(errorMessageCreator(null));
    };
  }, [successMessage, errorMessageCreator, dispatch]);
};

export default useRenderSuccessMessage;
