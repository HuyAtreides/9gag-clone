import { AppDispatch } from '../../Store';
import {
  downvotePost,
  unDownvotePost,
  unUpvotePost,
  upvotePost,
} from '../../Store/post/post-dispatchers';
import VoteActionExecutor from './vote-action-executor';

export default class VotePostActionExecutor implements VoteActionExecutor {
  private readonly dispatch: AppDispatch;
  private readonly postIndex: number;

  public constructor(dispatch: AppDispatch, postIndex: number = 0) {
    this.dispatch = dispatch;
    this.postIndex = postIndex;
  }

  public executeUpvoteAction(): void {
    this.dispatch(upvotePost(this.postIndex));
  }

  public executeDownvoteAction(): void {
    this.dispatch(downvotePost(this.postIndex));
  }

  public executeUndownvoteAction(): void {
    this.dispatch(unDownvotePost(this.postIndex));
  }

  public executeUnupvoteAction(): void {
    this.dispatch(unUpvotePost(this.postIndex));
  }
}
