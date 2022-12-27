export default interface VoteActionExecutor {
  executeUpvoteAction(): void;
  executeDownvoteAction(): void;
  executeUnupvoteAction(): void;
  executeUndownvoteAction(): void;
}
