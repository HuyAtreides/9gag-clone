import { List } from 'antd';
import React, { useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppThunk, useAppDispatch, useAppSelector } from '../../Store';
import {
  resetState,
  setUserSummaryErrorMessage,
} from '../../Store/user-summary/user-summary-slice';
import { InfiniteScrollHeight } from '../../context/infinite-scroll-height';
import useRemoveErrorWhenUnmount from '../../custom-hooks/remove-error';
import useRenderErrorMessage from '../../custom-hooks/render-error-message';
import { Constant, ScreenBreakPoint } from '../../models/enums/constant';
import PageOptions from '../../models/page-options';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import { User } from '../../models/user';
import CenterSpinner from '../center-spinner/CenterSpinner';
import UserSummaryListSkeleton from '../user-summary-list-skeleton/UserSummaryListSkeleton';

interface Props {
  readonly UserSummary: React.FC<{ user: User }>;
  readonly fetchUsers: (request: PageFetchingRequest) => AppThunk;
  readonly appendUsers: (request: PageFetchingRequest) => AppThunk;
}

const itemLayout =
  window.innerWidth <= ScreenBreakPoint.Medium ? 'vertical' : 'horizontal';

const UserSummaryList: React.FC<Props> = ({ UserSummary, fetchUsers, appendUsers }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.userSummary.isLoading);
  const users = useAppSelector((state) => state.userSummary.users);
  const page = useAppSelector((state) => state.userSummary.pagination?.page);
  const isLast = useAppSelector((state) => state.userSummary.pagination?.isLast);
  const errorMessage = useAppSelector((state) => state.userSummary.errorMessage);
  const isGettingPage = useAppSelector((state) => state.userSummary.isGettingPage);
  const infiniteScrollHeight = useContext(InfiniteScrollHeight);

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
    return <UserSummaryListSkeleton />;
  }

  return (
    <InfiniteScroll
      dataLength={users!.length}
      next={getNextPage}
      hasMore={isLast !== undefined && !isLast}
      loader={<CenterSpinner />}
      height={infiniteScrollHeight}
    >
      <List
        dataSource={users}
        itemLayout={itemLayout}
        renderItem={(user, _) => React.createElement(UserSummary, { user, key: user.id })}
      />
    </InfiniteScroll>
  );
};

export default UserSummaryList;
