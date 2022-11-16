import { useAppDispatch } from '../Store';
import { ActionCreator } from '../utils/types/action-creator';

type HandleDownvoteFunc = (
  unDownvoteActionCreator: ActionCreator<number>,
  downvoteActionCreator: ActionCreator<number>,
  index?: number,
) => void;

const useDownvote = (isDownvoted: boolean): HandleDownvoteFunc => {
  const dispatch = useAppDispatch();

  const handleDownvote = (
    unDownvoteActionCreator: ActionCreator<number>,
    downvoteActionCreator: ActionCreator<number>,
    index?: number,
  ) => {
    if (isDownvoted) {
      dispatch(unDownvoteActionCreator(index));
    } else {
      dispatch(downvoteActionCreator(index));
    }
  };

  return handleDownvote;
};

export default useDownvote;
