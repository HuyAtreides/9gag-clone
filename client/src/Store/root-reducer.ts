import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './auth/auth-slice';
import { userReducer } from './user/user-slice';
import { sectionReducer } from './section/section-slice';
import { postReducer } from './post/post-slice';
import { notificationReducer } from './notification/notification-slice';
import { commentReducer } from './comment/comment-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  section: sectionReducer,
  post: postReducer,
  comment: commentReducer,
  notification: notificationReducer,
});

export default rootReducer;
