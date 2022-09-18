import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './auth/auth-slice';
import { userReducer } from './user/user-slice';
import { sectionReducer } from './section/section-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  section: sectionReducer
});

export default rootReducer;
