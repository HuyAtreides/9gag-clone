import React, { useMemo } from 'react';
import { Menu, MenuProps } from 'antd';
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
                        href="https://about.9gag.com/tos"
                        target="_blank"
                    >
                        Terms
                    </a>,
                    '1',
                ),
                getItem(
                    <a
                        className={styles.item}
                        href="https://about.9gag.com/privacy"
                        target="_blank"
                    >
                        Privacy
                    </a>,
                    '2',
                ),
                getItem(
                    <a
                        className={styles.item}
                        href="https://about.9gag.com/copyright"
                        target="_blank"
                    >
                        Copyright
                    </a>,
                    '3',
                ),
            ]),
            getItem('Advertise', 'sub2', [
                getItem(
                    <a
                        className={styles.item}
                        href="https://about.9gag.com/advertise"
                        target="_blank"
                    >
                        Advertise on 9GAG
                    </a>,
                    '4',
                ),
                getItem(
                    <a
                        className={styles.item}
                        href="https://about.9gag.com/report-bad-ads"
                        target="_blank"
                    >
                        Report ads
                    </a>,
                    '5',
                ),
            ]),
            getItem('Contact', 'sub4', [
                getItem(
                    <a
                        className={styles.item}
                        href="https://about.9gag.com/jobs"
                        target="_blank"
                    >
                        Career
                    </a>,
                    '6',
                ),
                getItem(
                    <a
                        className={styles.item}
                        href="https://about.9gag.com/contact"
                        target="_blank"
                    >
                        Business enquiry
                    </a>,
                    '7',
                ),
            ]),
        ];
    }, []);

    return <Menu mode="inline" className={styles.menu} items={items} />;
};

export default DropdownMenu;
