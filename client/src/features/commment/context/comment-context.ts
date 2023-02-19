import React from 'react';
import { SortType } from '../../../models/enums/sort-type';
import { User } from '../../../models/user';
import { CommentActionType, CommentState } from '../../../Store/comment/comment-slice';
import { AppAction } from '../../../utils/types/app-action';

export const CommentContext = React.createContext<{
  user: User;
  state: CommentState;
  dispatch: React.Dispatch<AppAction<CommentActionType>>;
  sortType: SortType;
} | null>(null);
