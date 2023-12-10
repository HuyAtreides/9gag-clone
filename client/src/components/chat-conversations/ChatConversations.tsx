import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import useAddNewConversationDialog from '../../custom-hooks/use-add-new-conversation-dialog';
import AddNewConversationDialog from '../../features/chat/components/AddNewConversationDialog/AddNewConversationDialog';
import styles from './ChatConversations.module.css';
import ConversationsList from './ConversationsList';

const ChatConversations = () => {
  const [open, openDialog, closeDialog, createConversation] =
    useAddNewConversationDialog();

  return (
    <>
      <div className={styles.chatConversationsListHeader}>
        <Typography.Title level={4}>Chat Conversations</Typography.Title>
        <Button
          icon={<PlusOutlined />}
          type='text'
          title='Add new conversations'
          onClick={openDialog}
        />
      </div>
      <ConversationsList />
      <AddNewConversationDialog
        open={open}
        close={closeDialog}
        createConversation={createConversation}
      />
    </>
  );
};

export default ChatConversations;
