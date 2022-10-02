import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useAppDispatch } from '../Store';

const useUpvote = () => {
  const dispatch = useAppDispatch();
  const [upvoted, setUpvoted] = useState(false);

  const handleUpvote = (
    unUpvoteActionCreator: ActionCreatorWithPayload<number | undefined>,
    upvoteActionCreator: ActionCreatorWithPayload<number | undefined>,
    index?: number,
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
