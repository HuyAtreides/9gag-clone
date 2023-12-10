import { Affix, Button } from 'antd';
import styles from './ChatConversations.module.css';
import { PlusOutlined } from '@ant-design/icons';
import useAddNewConversationDialog from '../../custom-hooks/use-add-new-conversation-dialog';
import AddNewConversationDialog from '../../features/chat/components/AddNewConversationDialog/AddNewConversationDialog';

const AffixAddConversationButton = () => {
  const [open, openDialog, closeDialog, createConversation] =
    useAddNewConversationDialog();

  return (
    <>
      <Affix className={styles.affixAddConversationButton}>
        <Button
          icon={<PlusOutlined />}
          type='primary'
          title='Add new conversation'
          shape='circle'
          size='large'
          onClick={openDialog}
        />
      </Affix>
      <AddNewConversationDialog
        open={open}
        createConversation={createConversation}
        close={closeDialog}
      />
    </>
  );
};

export default AffixAddConversationButton;
