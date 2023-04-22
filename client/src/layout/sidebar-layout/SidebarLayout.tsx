import { Layout } from 'antd';
import { ReactNode } from 'react';
import Sidebar from '../../features/Home/Components/Sidebar';
import styles from './SidebarLayout.module.scss';

const { Sider, Content } = Layout;

interface Props {
  readonly children?: ReactNode;
  readonly sideBarCollapse: boolean;
  readonly setSideBarCollapse: (collapse: boolean) => void;
}

const SideBarLayout: React.FC<Props> = ({
  children,
  sideBarCollapse,
  setSideBarCollapse,
}) => {
  return (
    <Layout className={styles.layout} hasSider>
      <Sider
        breakpoint='lg'
        collapsed={sideBarCollapse}
        collapsedWidth={0}
        className={styles.sidebar}
      >
        <Sidebar />
      </Sider>

      {sideBarCollapse ? (
        <div className={styles['collapsed-spacer']}></div>
      ) : (
        <>
          <div className={styles.spacer}></div>
          <div
            className='overlay-background'
            onClick={() => setSideBarCollapse(true)}
          ></div>
        </>
      )}

      <Content className={styles.content}>{children}</Content>
    </Layout>
  );
};

export default SideBarLayout;
