import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './ChatConversations.module.css';

const ChatConversations = () => {
  return (
    <>
      <div className={styles.chatConversationsListHeader}>
        <Typography.Title level={4}>Chat Conversations </Typography.Title>
        <Button icon={<PlusOutlined />} type='text' title='Add new conversations' />
      </div>
      <InfiniteScroll
        hasMore={false}
        next={() => {}}
        dataLength={4}
        loader
        height={window.innerHeight * 0.7}
      >
        <List
          dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
          itemLayout='horizontal'
          bordered={false}
          renderItem={(item) => (
            <List.Item role='button' className={styles.chatConversation}>
              <List.Item.Meta
                avatar={
                  <Avatar src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp' />
                }
                title={<span>Jesses Pinkman</span>}
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  );
};

export default ChatConversations;
