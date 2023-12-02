import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './ConversationPreview.module.css';
import useTimeDiffFromToday from '../../../../custom-hooks/use-time-diff-from-today';
import { Link } from 'react-router-dom';

const ConversationsPreview = () => {
  const commentDateDiff = useTimeDiffFromToday(new Date());

  return (
    <>
      <Typography.Title level={3}>Chats</Typography.Title>
      <Input
        className={styles.searchConversation}
        size='large'
        placeholder='Search conversation...'
        prefix={<SearchOutlined />}
      />
      <div className={styles.markAsReadButtonContainer}>
        <Button type='text' className={styles.markAsReadButton}>
          Mark all as read
        </Button>
      </div>
      <InfiniteScroll
        hasMore={false}
        next={() => {}}
        dataLength={4}
        loader
        height={window.innerHeight * 0.45}
      >
        <List
          dataSource={[1, 2, 3, 4]}
          itemLayout='horizontal'
          renderItem={(item) => (
            <List.Item
              role='button'
              className={styles.conversationPreview}
              extra={<span className={styles.unreadMark}></span>}
            >
              <List.Item.Meta
                avatar={
                  <Avatar src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp' />
                }
                title={<Link to='/'>Name</Link>}
                description={
                  <span className={styles.latestMessagePreview}>
                    <Typography.Paragraph
                      className={styles.messageContentPreview}
                      ellipsis={{
                        expandable: false,
                        rows: 1,
                        suffix: '',
                      }}
                    >
                      You: Ant Design, a design language for background applications, is
                      refined by Ant UED Team Ant Design, a design language for background
                      applications, is refined by Ant UED Team Ant Design, a design
                      language for background applications, is refined by Ant UED Team Ant
                      Design, a design language for background applications, is refined by
                      Ant UED Team Ant Design, a design language for background
                      applications, is refined by Ant UED Team Ant Design, a design
                      language for background applications, is refined by Ant UED Team Ant
                      Design, a design language for background applications, is refined by
                      Ant UED Team Ant Design, a design language for background
                      applications, is refined by Ant UED Team
                    </Typography.Paragraph>
                    <Typography.Paragraph className={styles.messageContentDate}>
                      &#8226; {commentDateDiff}
                    </Typography.Paragraph>
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  );
};

export default ConversationsPreview;
