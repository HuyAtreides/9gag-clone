import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './auth/auth-slice';
import { userReducer } from './user/user-slice';
import { sectionReducer } from './section/section-slice';
import { postReducer } from './post/post-slice';
import { notificationReducer } from './notification/notification-slice';
import { commentReducer } from './comment/comment-slice';
import { abbreviateCommentReducer } from './abbreviate-comment/abbreviate-comment-slice';
import { userSummaryReducers } from './user-summary/user-summary-slice';
import { followRequestReducer } from './follow-request/follow-request-slice';
import { chatReducer } from './chat/chat-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  section: sectionReducer,
  post: postReducer,
  comment: commentReducer,
  notification: notificationReducer,
  abbreviateComment: abbreviateCommentReducer,
  userSummary: userSummaryReducers,
  followRequest: followRequestReducer,
  chat: chatReducer,
});

export default rootReducer;
