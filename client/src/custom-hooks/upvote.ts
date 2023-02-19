import VoteActionExecutor from './vote-action-executor/vote-action-executor';

const useUpvote = (
  { isUpvoted, isDownvoted }: { isUpvoted: boolean; isDownvoted: boolean },
  voteActionExecutor: VoteActionExecutor,
) => {
  const handleUpvote = () => {
    if (isUpvoted) {
      voteActionExecutor.executeUnupvoteAction();
      return;
    }

    if (isDownvoted) {
      voteActionExecutor.executeUndownvoteAction();
    }

    voteActionExecutor.executeUpvoteAction();
  };

  return handleUpvote;
};

export default useUpvote;
