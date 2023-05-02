import { Divider, List, Select, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  appendRequestPage,
  getRequestPage,
} from '../../../../Store/follow-request/follow-request-dispatchers';
import {
  reset,
  setErrorMessage,
} from '../../../../Store/follow-request/follow-request-slice';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import FollowRequest from '../../../../components/follow-request/FollowRequest';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { Constant } from '../../../../models/enums/constant';
import { FollowRequestDirection } from '../../../../models/enums/follow-request-direction';
import { FollowRequestStatus } from '../../../../models/enums/follow-request-status';
import PageOptions from '../../../../models/page-options';
import { FollowRequestFetchingRequest } from '../../../../models/requests/follow-request-fetching-request';

enum RequestStatusFilter {
  ALL,
  DECLINED,
  ACCEPTED,
  PENDING,
}

type ValidItemKey = 'received-follow-requests' | 'sent-follow-requests';

const ITEM_KEY_TO_DIRECTION_MAP: Record<ValidItemKey, FollowRequestDirection> = {
  'received-follow-requests': FollowRequestDirection.RECEIVED,
  'sent-follow-requests': FollowRequestDirection.SENT,
};

const FILTER_REQUEST_STATUS_TO_REQUEST_STATUS: Record<
  RequestStatusFilter,
  FollowRequestStatus | undefined
> = {
  [RequestStatusFilter.ALL]: undefined,
  [RequestStatusFilter.DECLINED]: FollowRequestStatus.DECLINED,
  [RequestStatusFilter.ACCEPTED]: FollowRequestStatus.ACCEPTED,
  [RequestStatusFilter.PENDING]: FollowRequestStatus.PENDING,
};

const UserFollowRequests: React.FC = () => {
  const requestStates = useAppSelector((state) => state.followRequest.requestStates);
  const pagination = useAppSelector((state) => state.followRequest.pagination);
  const isGettingNextPage = useAppSelector(
    (state) => state.followRequest.isGettingNextRequests,
  );
  const { itemKey } = useParams();
  const direction =
    ITEM_KEY_TO_DIRECTION_MAP[itemKey as ValidItemKey] || FollowRequestDirection.RECEIVED;
  const errorMessage = useAppSelector((state) => state.followRequest.errorMessage);
  const isLoading = useAppSelector((state) => state.followRequest.isLoading);
  const [status, setStatus] = useState<RequestStatusFilter>(RequestStatusFilter.ALL);
  const [searchParams] = useSearchParams();
  const requestId = Number(searchParams.get('requestId'));
  const dispatch = useAppDispatch();

  useRenderErrorMessage(errorMessage, setErrorMessage);

  const getNextPage = () => {
    if (isGettingNextPage || !pagination) {
      return;
    }

    const nextPageOptions: PageOptions = {
      page: pagination.page + 1,
      size: Constant.PageSize as number,
    };
    const fetchPageRequest = {
      pageOptions: nextPageOptions,
      status: FILTER_REQUEST_STATUS_TO_REQUEST_STATUS[status],
      direction,
    };

    dispatch(appendRequestPage(fetchPageRequest));
  };

  useEffect(() => {
    const priorityIds = requestId ? [requestId] : undefined;
    const pageFetchingRequest: FollowRequestFetchingRequest = {
      pageOptions: {
        page: 0,
        size: Constant.PageSize as number,
      },
      status: FILTER_REQUEST_STATUS_TO_REQUEST_STATUS[status],
      direction,
      priorityIds,
    };
    dispatch(getRequestPage(pageFetchingRequest));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, status, direction, requestId]);

  return (
    <>
      <Typography.Title level={3}>
        {direction === FollowRequestDirection.RECEIVED
          ? 'Received Follow Requests'
          : 'Sent Follow Requests'}
      </Typography.Title>
      <Divider />
      <Typography.Text strong>Status: </Typography.Text>
      <Select
        bordered={false}
        options={[
          { value: RequestStatusFilter.ACCEPTED, label: 'Accepted' },
          { value: RequestStatusFilter.DECLINED, label: 'Declined' },
          { value: RequestStatusFilter.PENDING, label: 'Pending' },
          { value: RequestStatusFilter.ALL, label: 'All' },
        ]}
        value={status}
        onChange={setStatus}
      />
      <br></br>
      <br></br>
      {isLoading ? (
        Array.from(Array(3)).map((_, __) => (
          <>
            <Skeleton avatar paragraph={{ rows: 3 }} active />
            <br />
          </>
        ))
      ) : (
        <InfiniteScroll
          dataLength={requestStates.length}
          next={getNextPage}
          hasMore={pagination != null && !pagination.isLast}
          loader={<CenterSpinner />}
        >
          <List
            dataSource={requestStates}
            renderItem={(requestState, index) => (
              <FollowRequest id={requestState.request.id} key={requestState.request.id} />
            )}
          />
        </InfiniteScroll>
      )}
    </>
  );
};

export default UserFollowRequests;
