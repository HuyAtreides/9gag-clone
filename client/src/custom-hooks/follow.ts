import { Modal } from 'antd';
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
      Modal.confirm({
        onOk: () => {
          dispatch(unFollowThunkAction);
          return false;
        },
        title: 'Do you want to unfollow this user?',
      });
      return;
    }

    dispatch(followThunkAction);
  };
};

export default useFollow;
