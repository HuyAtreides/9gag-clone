import { Card, Skeleton, Spin } from 'antd';
import styles from './ChatBox.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';

const ChatBoxSkeleton = () => {
  return (
    <Card
      title={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      className={styles.chatBox}
    >
      <Spin>
        <InfiniteScroll
          hasMore={false}
          next={() => {}}
          dataLength={4}
          loader
          height={window.innerHeight * 0.45}
          className={styles.chatBoxContent}
        >
          <></>
        </InfiniteScroll>
      </Spin>
    </Card>
  );
};

export default ChatBoxSkeleton;
