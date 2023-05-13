import { SearchOutlined } from '@ant-design/icons';
import { Divider, Input, Typography } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../Store';
import {
  addToRecentSearch,
  appendSearchResult,
  search,
} from '../../Store/user-summary/user-summary-dispatcher';
import { InfiniteScrollHeight } from '../../context/infinite-scroll-height';
import { Constant } from '../../models/enums/constant';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import { User } from '../../models/user';
import UserSummaryList from '../user-summary-list/UserSummaryList';
import UserSummary from '../user-summary/UserSummary';
import RecentUserSearch from './RecentUserSearch';
import styles from './UserSearch.module.scss';
import { UserSearchDrawerContext } from '../../features/Home/Components/Sidebar';

const UserSearchResult: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const closeDrawer = useContext(UserSearchDrawerContext);

  const handleAddToRecentSearch = () => {
    dispatch(addToRecentSearch(user.id));
    closeDrawer();
  };

  return (
    <Link to={`/user/${user.id}`} onClick={handleAddToRecentSearch} reloadDocument>
      <UserSummary actions={[]} user={user} />
    </Link>
  );
};

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [workingOnSearchResult, setWorkingOnSearchResult] = useState(false);
  const [focus, setFocus] = useState(false);

  const searchUser = useCallback(
    (pageRequest: PageFetchingRequest) => {
      return search({
        pageOptions: {
          ...pageRequest.pageOptions,
          search: searchTerm || undefined,
        },
      });
    },
    [searchTerm],
  );

  const appendSearchUser = useCallback(
    (pageRequest: PageFetchingRequest) => {
      return appendSearchResult({
        pageOptions: {
          ...pageRequest.pageOptions,
          search: searchTerm || undefined,
        },
      });
    },
    [searchTerm],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value.trim();
      setSearchTerm(searchTerm.length === 0 ? null : searchTerm);
    }, Constant.DebounceTimeInMiliSeconds),
    [],
  );

  useEffect(() => {
    document.onclick = () => {
      if (!workingOnSearchResult && !focus) {
        setShowSearchResult(false);
      }
    };

    return () => {
      document.onclick = null;
    };
  }, [focus, workingOnSearchResult]);

  const searchResult = searchTerm ? (
    <InfiniteScrollHeight.Provider value='45vh'>
      <UserSummaryList
        fetchUsers={searchUser}
        appendUsers={appendSearchUser}
        UserSummary={UserSearchResult}
      />
    </InfiniteScrollHeight.Provider>
  ) : (
    <InfiniteScrollHeight.Provider value='45vh'>
      <RecentUserSearch />
    </InfiniteScrollHeight.Provider>
  );

  return (
    <div>
      <Typography.Title level={4}>Search Users</Typography.Title>
      <div className={styles.searchContainer}>
        <Input
          onFocus={() => {
            setShowSearchResult(true);
            setFocus(true);
          }}
          onBlur={() => {
            if (!workingOnSearchResult) {
              setShowSearchResult(false);
            }
            setFocus(false);
          }}
          prefix={<SearchOutlined />}
          placeholder='Search'
          allowClear
          onChange={handleSearch}
          className={styles.searchBox}
        ></Input>
        {showSearchResult && (
          <div
            className={styles.searchResult}
            onMouseLeave={() => setWorkingOnSearchResult(false)}
            onMouseEnter={() => setWorkingOnSearchResult(true)}
          >
            <Typography.Title level={5}>
              {searchTerm ? 'Result' : 'Recent'}
            </Typography.Title>
            <Divider />
            {searchResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
