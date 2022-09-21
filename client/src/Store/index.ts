import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import rootReducer from './root-reducer';

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk = ThunkAction<void, RootState, undefined, Action<string>>;

export default store;
