import { Col, Row, Statistic } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../Store';
import { getStats } from '../../Store/user/user-dipatchers';
import { setUserStats } from '../../Store/user/user-slice';
import { formatNumber } from '../../utils/format-number';

const UserStats: React.FC<{ userId: number }> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const isGettingUserStats = useAppSelector((state) => state.user.isGettingUserStats);
  const userStats = useAppSelector((state) => state.user.stats);

  useEffect(() => {
    dispatch(getStats(userId));

    return () => {
      dispatch(setUserStats(null));
    };
  }, [dispatch, userId]);

  return (
    <Row gutter={15} justify='center'>
      <Col span={12}>
        <Statistic
          title='Posts'
          value={formatNumber(userStats?.posts || 0)}
          loading={isGettingUserStats}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title='Comments'
          value={formatNumber(userStats?.comments || 0)}
          loading={isGettingUserStats}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title='Following'
          value={formatNumber(userStats?.following || 0)}
          loading={isGettingUserStats}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title='Followers'
          value={formatNumber(userStats?.followers || 0)}
          loading={isGettingUserStats}
        />
      </Col>
    </Row>
  );
};

export default UserStats;
