import { useState } from 'react';
import { useAppDispatch } from '../Store';
import { ActionCreator } from '../utils/types/action-creator';

type HandleUpvoteFunc = (
  unUpvoteActionCreator: ActionCreator<number>,
  upvoteActionCreator: ActionCreator<number>,
  index?: number,
) => void;

const useUpvote = (initialUpvotedState: boolean): [boolean, HandleUpvoteFunc] => {
  const dispatch = useAppDispatch();
  const [upvoted, setUpvoted] = useState(initialUpvotedState);

  const handleUpvote = (
    unUpvoteActionCreator: ActionCreator<number>,
    upvoteActionCreator: ActionCreator<number>,
    index: number = 0,
  ) => {
    if (upvoted) {
      dispatch(unUpvoteActionCreator(index));
    } else {
      dispatch(upvoteActionCreator(index));
    }

    setUpvoted(!upvoted);
  };

  return [upvoted, handleUpvote];
};

export default useUpvote;
