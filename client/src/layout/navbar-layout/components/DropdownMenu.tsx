import { Menu, MenuProps } from 'antd';
import React, { useMemo } from 'react';
import styles from './DropdownMenu.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    children,
    label,
    type,
  } as MenuItem;
}

const DropdownMenu = () => {
  const items = useMemo<MenuItem[]>(() => {
    return [
      getItem('Terms & Policies', 'sub1', [
        getItem(
          <a
            className={styles.item}
            href='https://about.9gag.com/tos'
            target='_blank'
            rel='noreferrer'
          >
            Terms
          </a>,
          '1',
        ),
        getItem(
          <a
            className={styles.item}
            href='https://about.9gag.com/privacy'
            target='_blank'
            rel='noreferrer'
          >
            Privacy
          </a>,
          '2',
        ),
        getItem(
          <a
            className={styles.item}
            href='https://about.9gag.com/copyright'
            target='_blank'
            rel='noreferrer'
          >
            Copyright
          </a>,
          '3',
        ),
      ]),
    ];
  }, []);

  return <Menu mode='inline' className={styles.menu} items={items} />;
};

export default DropdownMenu;
