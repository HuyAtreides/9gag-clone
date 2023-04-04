import { AppThunk, useAppDispatch } from '../Store';

interface UseFollowParams {
  readonly followThunkAction: AppThunk;
  readonly unFollowThunkAction: AppThunk;
  readonly isFollowed: boolean;
}

const useFollow = ({
  isFollowed,
  followThunkAction,
  unFollowThunkAction,
}: UseFollowParams) => {
  const dispatch = useAppDispatch();
  return () => {
    if (isFollowed) {
      dispatch(unFollowThunkAction);
      return;
    }

    dispatch(followThunkAction);
  };
};

export default useFollow;
