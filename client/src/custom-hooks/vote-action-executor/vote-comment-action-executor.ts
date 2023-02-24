import React from 'react';
import {
  downvoteComment,
  unDownvoteComment,
  unUpvoteComment,
  upvoteComment,
} from '../../Store/comment/comment-dispatchers';
import { CommentActionType, CommentState } from '../../Store/comment/comment-slice';
import { AppAction } from '../../utils/types/app-action';
import VoteActionExecutor from './vote-action-executor';

export default class VoteCommentActionExecutor implements VoteActionExecutor {
  private readonly dispatch: React.Dispatch<AppAction<CommentActionType>>;
  private readonly id: number;
  private readonly state: CommentState;

  public constructor(
    dispatch: React.Dispatch<AppAction<CommentActionType>>,
    id: number,
    state: CommentState,
  ) {
    this.dispatch = dispatch;
    this.id = id;
    this.state = state;
  }

  public executeUpvoteAction(): void {
    upvoteComment(this.id)(this.state, this.dispatch);
  }

  public executeDownvoteAction(): void {
    downvoteComment(this.id)(this.state, this.dispatch);
  }

  public executeUndownvoteAction(): void {
    unDownvoteComment(this.id)(this.state, this.dispatch);
  }

  public executeUnupvoteAction(): void {
    unUpvoteComment(this.id)(this.state, this.dispatch);
  }
}
