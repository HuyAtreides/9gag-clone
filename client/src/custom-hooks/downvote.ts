import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useAppDispatch } from '../Store';

const useDownvote = () => {
  const dispatch = useAppDispatch();
  const [downvoted, setDownvoted] = useState(false);

  const handleUpvote = (
    unDownvoteActionCreator: ActionCreatorWithPayload<number | undefined>,
    downvoteActionCreator: ActionCreatorWithPayload<number | undefined>,
    index?: number,
  ) => {
    if (downvoted) {
      dispatch(unDownvoteActionCreator(index));
    } else {
      dispatch(downvoteActionCreator(index));
    }

    setDownvoted(!downvoted);
  };

  return [downvoted, handleUpvote];
};

export default useDownvote;
