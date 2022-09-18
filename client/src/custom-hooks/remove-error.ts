import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useAppDispatch } from '../Store';

/** Custom hook which helps remove the error message when the component unmount. */
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
