import { List, Select, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AbbreviateComment from '../../../../components/abbreviate-comment/AbbreviateComment';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import { Constant } from '../../../../models/enums/constant';
import { SortType } from '../../../../models/enums/sort-type';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  getCommentsOfUser,
  getNextCommentsOfUser,
} from '../../../../Store/abbreviate-comment/abbreviate-comment-dispatchers';
import { resetState } from '../../../../Store/abbreviate-comment/abbreviate-comment-slice';

interface Props {
  readonly userId: number;
}

const UserComments: React.FC<Props> = ({ userId }) => {
  const comments = useAppSelector((state) => state.abbreviateComment.comments);
  const isLoading = useAppSelector((state) => state.abbreviateComment.isGettingComments);
  const isGettingNextPage = useAppSelector(
    (state) => state.abbreviateComment.isGettingNextComments,
  );
  const [sortType, setSortType] = useState(SortType.TOP);
  const dispatch = useAppDispatch();
  const pagination = useAppSelector((state) => state.abbreviateComment.pagination);
  const hasMoreComments = !pagination || !pagination.isLast;
  const getNextPage = () => {
    if (isLoading || isGettingNextPage || !pagination) {
      return;
    }

    const pageOptions = {
      page: pagination.page + 1,
      size: Constant.PageSize as number,
      sortType,
    };
    dispatch(
      getNextCommentsOfUser({
        userId,
        pageOptions,
      }),
    );
  };

  useEffect(() => {
    const pageOptions = {
      page: 0,
      size: Constant.PageSize as number,
      sortType,
    };
    dispatch(
      getCommentsOfUser({
        userId,
        pageOptions,
      }),
    );

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, userId, sortType]);

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
    <>
      <Select
        bordered={false}
        options={[
          { value: SortType.TOP, label: 'Top Comments' },
          { value: SortType.FRESH, label: 'Latest Comments' },
        ]}
        value={sortType}
        onChange={setSortType}
      />
      <InfiniteScroll
        dataLength={comments.length}
        next={getNextPage}
        hasMore={hasMoreComments}
        loader={<CenterSpinner />}
      >
        <List
          dataSource={comments}
          renderItem={(comment, index) => (
            <List.Item>
              <AbbreviateComment comment={comment} />
            </List.Item>
          )}
          itemLayout='vertical'
        />
      </InfiniteScroll>
    </>
  );
};

export default UserComments;
