import { useAppDispatch } from '../Store';
import { ActionCreator } from '../utils/types/action-creator';

type HandleUpvoteFunc = (
  unUpvoteActionCreator: ActionCreator<number>,
  upvoteActionCreator: ActionCreator<number>,
  index?: number,
) => void;

const useUpvote = (isUpvoted: boolean): HandleUpvoteFunc => {
  const dispatch = useAppDispatch();

  const handleUpvote = (
    unUpvoteActionCreator: ActionCreator<number>,
    upvoteActionCreator: ActionCreator<number>,
    index: number = 0,
  ) => {
    if (isUpvoted) {
      dispatch(unUpvoteActionCreator(index));
    } else {
      dispatch(upvoteActionCreator(index));
    }
  };

  return handleUpvote;
};

export default useUpvote;
