import VoteActionExecutor from './vote-action-executor/vote-action-executor';

const useDownvote = (
  { isDownvoted, isUpvoted }: { isUpvoted: boolean; isDownvoted: boolean },
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
