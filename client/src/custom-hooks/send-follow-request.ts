import { AppThunk, useAppDispatch } from '../Store';

interface UseFollowParams {
  readonly sendRequestThunkAction: AppThunk;
  readonly cancelRequestThunkAction: AppThunk;
  readonly receivedRequest: boolean;
}

const useSendFollowRequest = ({
  receivedRequest,
  sendRequestThunkAction,
  cancelRequestThunkAction,
}: UseFollowParams) => {
  const dispatch = useAppDispatch();
  return () => {
    if (receivedRequest) {
      dispatch(cancelRequestThunkAction);
      return;
    }

    dispatch(sendRequestThunkAction);
  };
};

export default useSendFollowRequest;
