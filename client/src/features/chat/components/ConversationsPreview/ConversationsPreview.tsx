import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import useDebounceSearch from '../../../../custom-hooks/use-debounce-search';
import styles from './ConversationPreview.module.css';
import ConversationPreviewList from './ConversationsPreviewList';

const ConversationsPreview = () => {
  const [searchTerm, handleSearch] = useDebounceSearch();

  return (
    <>
      <Typography.Title level={3}>Chats</Typography.Title>
      <Input
        className={styles.searchConversation}
        size='large'
        placeholder='Search conversation...'
        onChange={handleSearch}
        prefix={<SearchOutlined />}
      />
      <div className={styles.markAsReadButtonContainer}>
        <Button type='text' className={styles.markAsReadButton}>
          Mark all as read
        </Button>
      </div>
      <ConversationPreviewList searchTerm={searchTerm} />
    </>
  );
};

export default ConversationsPreview;
