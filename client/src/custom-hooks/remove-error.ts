import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useAppDispatch } from '../Store';

const useRemoveErrorWhenUnmount = (
  errorMessageCreator: ActionCreatorWithPayload<string | null>,
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(errorMessageCreator(null));
    };
  }, [dispatch, errorMessageCreator]);
};

export default useRemoveErrorWhenUnmount;
