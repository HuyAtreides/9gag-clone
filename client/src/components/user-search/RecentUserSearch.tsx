import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import {
  appendRecentSearch,
  getRecentSearch,
  removeRecentSearch,
} from '../../Store/user-summary/user-summary-dispatcher';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import { User } from '../../models/user';
import UserSummaryList from '../user-summary-list/UserSummaryList';
import UserSummary from '../user-summary/UserSummary';
import { Link, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';
import { useAppDispatch } from '../../Store';

const RecentUserSearchSummary: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const remove = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(removeRecentSearch(user.id));
  };

  return (
    <Link
      to={`/user/${user.id}`}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        navigate(`/user/${user.id}`);
      }}
    >
      <UserSummary
        actions={[
          <Button icon={<CloseOutlined />} type='text' title='Remove' onClick={remove} />,
        ]}
        user={user}
      />
    </Link>
  );
};

const RecentUserSearch: React.FC = () => {
  const fetchRecentSearches = useCallback((pageRequest: PageFetchingRequest) => {
    return getRecentSearch(pageRequest);
  }, []);

  const appendRecentSearches = useCallback((pageRequest: PageFetchingRequest) => {
    return appendRecentSearch(pageRequest);
  }, []);
  return (
    <UserSummaryList
      fetchUsers={fetchRecentSearches}
      appendUsers={appendRecentSearches}
      UserSummary={RecentUserSearchSummary}
    />
  );
};

export default RecentUserSearch;
