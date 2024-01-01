import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import useDebounceSearch from '../../../../custom-hooks/use-debounce-search';
import styles from './ConversationPreview.module.css';
import ConversationPreviewList from './ConversationsPreviewList';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { readAllConversation } from '../../../../Store/chat/chat-dispatchers';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { setPreviewConversationError } from '../../../../Store/chat/chat-slice';

const ConversationsPreview = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, handleSearch] = useDebounceSearch();
  const previewError = useAppSelector(
    (state) => state.chat.conversationState.previewConversations.error,
  );

  useRenderErrorMessage(previewError, setPreviewConversationError);

  const readAll = () => {
    dispatch(readAllConversation());
  };

  return (
    <>
      <Typography.Title level={3}>Chats</Typography.Title>
      <Input
        className={styles.searchConversation}
        size='large'
        onClick={(e) => {
          e.stopPropagation();
        }}
        placeholder='Search conversation...'
        onChange={handleSearch}
        prefix={<SearchOutlined />}
      />
      <div className={styles.markAsReadButtonContainer}>
        <Button
          type='text'
          className={styles.markAsReadButton}
          onClick={(e) => {
            e.stopPropagation();
            readAll();
          }}
        >
          Mark all as read
        </Button>
      </div>
      <ConversationPreviewList searchTerm={searchTerm} />
    </>
  );
};

export default ConversationsPreview;
