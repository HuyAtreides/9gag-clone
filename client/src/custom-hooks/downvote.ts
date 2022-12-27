import Post from '../models/post';
import VoteActionExecutor from './vote-action-executor/vote-action-executor';

const useDownvote = (
  { isDownvoted, isUpvoted }: Post,
  voteActionExecutor: VoteActionExecutor,
) => {
  const handleDownvote = () => {
    if (isDownvoted) {
      voteActionExecutor.executeUndownvoteAction();
      return;
    }

    if (isUpvoted) {
      voteActionExecutor.executeUnupvoteAction();
    }

    voteActionExecutor.executeDownvoteAction();
  };

  return handleDownvote;
};

export default useDownvote;
