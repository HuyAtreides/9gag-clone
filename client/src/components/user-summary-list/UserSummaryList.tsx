import { List, Skeleton } from 'antd';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppThunk, useAppDispatch, useAppSelector } from '../../Store';
import {
  resetState,
  setUserSummaryErrorMessage,
} from '../../Store/user-summary/user-summary-slice';
import useRemoveErrorWhenUnmount from '../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../custom-hooks/render-error-message';
import { Constant } from '../../models/enums/constant';
import PageOptions from '../../models/page-options';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import { User } from '../../models/user';
import CenterSpinner from '../center-spinner/CenterSpinner';

interface Props {
  readonly UserSummary: React.FC<{ user: User }>;
  readonly fetchUsers: (request: PageFetchingRequest) => AppThunk;
  readonly appendUsers: (request: PageFetchingRequest) => AppThunk;
}

const UserSummaryList: React.FC<Props> = ({ UserSummary, fetchUsers, appendUsers }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.userSummary.isLoading);
  const users = useAppSelector((state) => state.userSummary.users);
  const page = useAppSelector((state) => state.userSummary.pagination?.page);
  const isLast = useAppSelector((state) => state.userSummary.pagination?.isLast);
  const errorMessage = useAppSelector((state) => state.userSummary.errorMessage);
  const isGettingPage = useAppSelector((state) => state.userSummary.isGettingPage);

  useRemoveErrorWhenUnmount(setUserSummaryErrorMessage);
  useRenderErrorMessage(errorMessage, setUserSummaryErrorMessage);

  const getNextPage = () => {
    if (isGettingPage) {
      return;
    }

    const nextPageOptions: PageOptions = {
      page: page! + 1,
      size: Constant.PageSize as number,
    };
    const fetchPageRequest = {
      pageOptions: nextPageOptions,
    };

    dispatch(appendUsers(fetchPageRequest));
  };

  useEffect(() => {
    const pageOptions: PageOptions = {
      page: 0,
      size: Constant.PageSize as number,
    };
    const fetchPageRequest = {
      pageOptions,
    };

    dispatch(fetchUsers(fetchPageRequest));

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, fetchUsers]);

  if (isLoading) {
    return (
      <>
        {Array.from(Array(3)).map((_, __) => (
          <>
            <Skeleton avatar paragraph={{ rows: 2 }} active />
            <br />
          </>
        ))}
      </>
    );
  }
  return (
    <InfiniteScroll
      dataLength={users!.length}
      next={getNextPage}
      hasMore={isLast !== undefined && !isLast}
      loader={<CenterSpinner />}
    >
      <List
        dataSource={users}
        renderItem={(user, _) => React.createElement(UserSummary, { user })}
      />
    </InfiniteScroll>
  );
};

export default UserSummaryList;
