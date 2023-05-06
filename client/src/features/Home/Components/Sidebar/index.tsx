import {
  BarChartOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Drawer, Menu, MenuProps, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import {
  addSectionToUserFavorite,
  getFavoriteSections,
  removeSectionFromUserFavorite,
} from '../../../../Store/user/user-dipatchers';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import useProtectedAction from '../../../../custom-hooks/protected-action';
import { SortType } from '../../../../models/enums/sort-type';
import Section from '../../../../models/section';
import isInEnum from '../../../../utils/is-in-enum';
import styles from './Sidebar.module.scss';
import UserSearch from '../../../../components/user-search/UserSearch';

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
  const sections = useAppSelector((state) => state.section.sections);
  const dispatch = useAppDispatch();
  const favoriteSections = useAppSelector((state) => state.user.favoriteSections);
  const user = useAppSelector((state) => state.user.profile);
  const { tag, section } = useParams();
  const protectAction = useProtectedAction();
  const selectedTags = tag ? [tag] : undefined;
  const selectedSections = section ? [section] : undefined;
  const navTag = tag ? tag : SortType.FRESH;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getFavoriteSections());
    }
  }, [user, dispatch]);

  const items = useMemo<MenuItem[]>(() => {
    return [
      getItem(
        <Link to={`/tag/${SortType.FRESH}`} className={styles.section}>
          Fresh
        </Link>,
        'fresh',
        <ClockCircleOutlined />,
      ),
      getItem(
        <Link to={`/tag/${SortType.TOP}`} className={styles.section}>
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
            to={`/tag/${navTag}/${section.name}`}
            className={styles.text}
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
  }, [dispatch, favoriteSections, navTag]);

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
              to={`/tag/${navTag}/${section.name}`}
              className={styles.text}
              title={section.displayName}
            >
              {section.displayName}
            </Link>

            <StarFilled
              className={styles.icon}
              onClick={protectAction(() => addToFavorite(section))}
            />
          </div>,

          section.name.toLowerCase(),
        ),
      );
  }, [sections, dispatch, favoriteSections, navTag, protectAction]);

  if (tag && !isInEnum(tag, SortType)) {
    return <Navigate to='/' />;
  }

  if (section && !sections.map((s) => s.name).includes(section)) {
    return <Navigate to='/' />;
  }

  return (
    <div className={styles.sidebar}>
      <Typography.Title className={styles.title}>9GAG</Typography.Title>
      <Menu mode='inline' selectedKeys={selectedTags} items={items} />

      <div className={styles.userSearch}>
        <Typography.Title className={styles.title}>Search Users</Typography.Title>
        <Menu
          mode='inline'
          selectable={false}
          onClick={() => setOpen(true)}
          items={[
            getItem(
              <span className={styles.section}>Search</span>,
              'search',
              <SearchOutlined />,
            ),
          ]}
        />
        <Drawer
          placement='right'
          visible={open}
          closable={true}
          onClose={() => setOpen(false)}
        >
          <UserSearch />
        </Drawer>
      </div>

      <AuthenticatedGuard
        component={
          <>
            <Typography.Title className={styles.title}>
              Favorite Sections
            </Typography.Title>
            <Menu
              mode='inline'
              selectedKeys={selectedSections}
              items={favoriteSectionItems}
            />
          </>
        }
      />
      <Typography.Title className={styles.title}>All Sections</Typography.Title>
      <Menu mode='inline' selectedKeys={selectedSections} items={items2} />
    </div>
  );
};

export default Sidebar;
