import { useState } from 'react';
import { useAppDispatch } from '../Store';
import { ActionCreator } from '../utils/types/action-creator';

type HandleDownvoteFunc = (
  unDownvoteActionCreator: ActionCreator<number>,
  downvoteActionCreator: ActionCreator<number>,
  index?: number,
) => void;

const useDownvote = (initialDownvotedState: boolean): [boolean, HandleDownvoteFunc] => {
  const dispatch = useAppDispatch();
  const [downvoted, setDownvoted] = useState(initialDownvotedState);

  const handleDownvote = (
    unDownvoteActionCreator: ActionCreator<number>,
    downvoteActionCreator: ActionCreator<number>,
    index?: number,
  ) => {
    if (downvoted) {
      dispatch(unDownvoteActionCreator(index));
    } else {
      dispatch(downvoteActionCreator(index));
    }

    setDownvoted(!downvoted);
  };

  return [downvoted, handleDownvote];
};

export default useDownvote;
