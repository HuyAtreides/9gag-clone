import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../Store';
import {
  appendRecentSearch,
  getRecentSearch,
  removeRecentSearch,
} from '../../Store/user-summary/user-summary-dispatcher';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import { User } from '../../models/user';
import UserSummaryList from '../user-summary-list/UserSummaryList';
import UserSummary from '../user-summary/UserSummary';
import { UserSearchDrawerContext } from '../../features/Home/Components/Sidebar';

const RecentUserSearchSummary: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const closeDrawer = useContext(UserSearchDrawerContext);

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
        closeDrawer();
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
