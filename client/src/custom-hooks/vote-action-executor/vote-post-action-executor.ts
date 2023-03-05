import Post from '../../models/post';
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
  private readonly post: Post;

  public constructor(dispatch: AppDispatch, post: Post) {
    this.dispatch = dispatch;
    this.post = post;
  }

  public executeUpvoteAction(): void {
    this.dispatch(upvotePost(this.post));
  }

  public executeDownvoteAction(): void {
    this.dispatch(downvotePost(this.post));
  }

  public executeUndownvoteAction(): void {
    this.dispatch(unDownvotePost(this.post));
  }

  public executeUnupvoteAction(): void {
    this.dispatch(unUpvotePost(this.post));
  }
}
