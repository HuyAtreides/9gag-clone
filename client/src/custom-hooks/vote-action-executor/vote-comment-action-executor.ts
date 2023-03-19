import { AppDispatch } from '../../Store';
import {
  downvoteComment,
  unDownvoteComment,
  unUpvoteComment,
  upvoteComment,
} from '../../Store/comment/comment-dispatchers';

import VoteActionExecutor from './vote-action-executor';

export default class VoteCommentActionExecutor implements VoteActionExecutor {
  private readonly dispatch: AppDispatch;
  private readonly id: number;

  public constructor(dispatch: AppDispatch, id: number) {
    this.dispatch = dispatch;
    this.id = id;
  }

  public executeUpvoteAction(): void {
    this.dispatch(upvoteComment(this.id));
  }

  public executeDownvoteAction(): void {
    this.dispatch(downvoteComment(this.id));
  }

  public executeUndownvoteAction(): void {
    this.dispatch(unDownvoteComment(this.id));
  }

  public executeUnupvoteAction(): void {
    this.dispatch(unUpvoteComment(this.id));
  }
}
