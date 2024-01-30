import { Button, Card, Typography } from 'antd';
import styles from './ChatBox.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CloseOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../../../Store';
import { closeConversation } from '../../../../Store/chat/chat-slice';

interface Props {
  readonly userId: number;
  readonly errorMessage: string;
}

const ChatBoxWithError = ({ userId, errorMessage }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <Card
      title={
        <Typography.Title level={5} type='danger'>
          Error
        </Typography.Title>
      }
      extra={[
        <Button
          icon={<CloseOutlined />}
          type='text'
          onClick={() => dispatch(closeConversation(userId))}
        />,
      ]}
      className={styles.chatBox}
    >
      <InfiniteScroll
        hasMore={false}
        next={() => {}}
        dataLength={4}
        loader
        height={window.innerHeight * 0.45}
        className={styles.chatBoxContentError}
      >
        <Typography.Text type='danger' strong className={styles.chatBoxErrorMessage}>
          {errorMessage}
        </Typography.Text>
      </InfiniteScroll>
    </Card>
  );
};

export default ChatBoxWithError;
