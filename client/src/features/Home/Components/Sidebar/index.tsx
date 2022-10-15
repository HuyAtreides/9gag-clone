import { Menu, MenuProps, Typography } from 'antd';
import {
  HomeFilled,
  RiseOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { getAllSection } from '../../../../Store/section/section-dipatchers';
import styles from './Sidebar.module.scss';
import { Link, useLocation, useMatch, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sections = useAppSelector((state) => state.section.sections);

  let keys = location.pathname.split('/');
  const tagKey = keys[2];
  const sectionKey = keys[3];

  const items = useMemo<MenuItem[]>(() => {
    return [
      getItem(
        <Link to='/tag/hot' className={styles.section}>
          Hot
        </Link>,
        'hot',
        <HomeFilled />,
      ),
      getItem(
        <Link to='/tag/trending' className={styles.section}>
          Trending
        </Link>,
        'trending',
        <RiseOutlined />,
      ),
      getItem(
        <Link to='/tag/fresh' className={styles.section}>
          Fresh
        </Link>,
        'fresh',
        <ClockCircleOutlined />,
      ),
      getItem(
        <Link to='/tag/top' className={styles.section}>
          Top
        </Link>,
        'top',
        <BarChartOutlined />,
      ),
    ];
  }, [sections]);

  const items2 = useMemo<MenuItem[]>(() => {
    return sections.map((section, index) =>
      getItem(
        <Link
          to={`${location.pathname}/${section.name.toLowerCase()}`}
          className={styles.section}
        >
          <Typography.Text className={styles.text}>{section.displayName}</Typography.Text>
          <StarFilled className={styles.icon} />
        </Link>,
        section.name.toLowerCase(),
      ),
    );
  }, [sections]);

  useEffect(() => {
    dispatch(getAllSection());
  }, []);

  return (
    <div className={styles.sidebar}>
      <Typography.Title className={styles.title}>9GAG</Typography.Title>
      <Menu mode='inline' selectedKeys={[tagKey]} items={items} />
      <Typography.Title className={styles.title}>Popular</Typography.Title>
      <Typography.Title className={styles.title}>All Sections</Typography.Title>
      <Menu mode='inline' selectedKeys={[sectionKey]} items={items2} />
    </div>
  );
};

export default Sidebar;
