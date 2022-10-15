import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './auth/auth-slice';
import { userReducer } from './user/user-slice';
import { sectionReducer } from './section/section-slice';
import { postReducer } from './post/post-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  section: sectionReducer,
  post: postReducer,
});

export default rootReducer;
