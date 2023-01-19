import { BarChartOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import { Menu, MenuProps, Typography } from 'antd';
import { SyntheticEvent, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import Section from '../../../../models/section';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addSectionToUserFavorite,
  removeSectionFromUserFavorite,
} from '../../../../Store/user/user-dipatchers';
import styles from './Sidebar.module.scss';

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
  const sections = useAppSelector((state) => state.section.sections);
  const dispatch = useAppDispatch();
  const favoriteSections = useAppSelector((state) => state.user.favoriteSections);

  let keys = location.pathname.split('/');
  const tagKey = keys[2];
  const sectionKey = keys[3];

  const preventNavigate = (event: SyntheticEvent) => {};

  const items = useMemo<MenuItem[]>(() => {
    return [
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
  }, []);

  const favoriteSectionItems = useMemo<MenuItem[]>(() => {
    if (!favoriteSections) {
      return [];
    }

    const removeFromFavorite = (section: Section) => {
      dispatch(removeSectionFromUserFavorite(section));
    };

    return favoriteSections.map((section, index) =>
      getItem(
        <div className={styles.section}>
          <Link
            to={`/tag/${tagKey}/${section.name}`}
            className={styles.text}
            onClick={preventNavigate}
            title={section.displayName}
          >
            {section.displayName}
          </Link>

          <StarFilled
            className={styles.highlightedIcon}
            onClick={() => removeFromFavorite(section)}
          />
        </div>,

        section.name.toLowerCase(),
      ),
    );
  }, [dispatch, favoriteSections, tagKey]);

  const items2 = useMemo<MenuItem[]>(() => {
    const addToFavorite = (section: Section) => {
      dispatch(addSectionToUserFavorite(section));
    };

    return sections
      .filter(
        (section) =>
          !favoriteSections?.find((favoriteSection) => favoriteSection.id === section.id),
      )
      .map((section, index) =>
        getItem(
          <div className={styles.section}>
            <Link
              to={`/tag/${tagKey}/${section.name}`}
              className={styles.text}
              onClick={preventNavigate}
              title={section.displayName}
            >
              {section.displayName}
            </Link>

            <StarFilled className={styles.icon} onClick={() => addToFavorite(section)} />
          </div>,

          section.name.toLowerCase(),
        ),
      );
  }, [sections, dispatch, favoriteSections, tagKey]);

  return (
    <div className={styles.sidebar}>
      <Typography.Title className={styles.title}>9GAG</Typography.Title>
      <Menu mode='inline' selectedKeys={[tagKey]} items={items} />
      <AuthenticatedGuard
        component={
          <>
            <Typography.Title className={styles.title}>
              Favorite Sections
            </Typography.Title>
            <Menu
              mode='inline'
              selectedKeys={[sectionKey]}
              items={favoriteSectionItems}
            />
          </>
        }
      />
      <Typography.Title className={styles.title}>All Sections</Typography.Title>
      <Menu mode='inline' selectedKeys={[sectionKey]} items={items2} />
    </div>
  );
};

export default Sidebar;
