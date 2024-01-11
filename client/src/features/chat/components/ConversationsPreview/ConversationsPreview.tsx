import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import useDebounceSearch from '../../../../custom-hooks/use-debounce-search';
import styles from './ConversationPreview.module.css';
import ConversationPreviewList from './ConversationsPreviewList';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { readAllConversation } from '../../../../Store/chat/chat-dispatchers';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import { setPreviewConversationError } from '../../../../Store/chat/chat-slice';
import useAddNewConversationDialog from '../../../../custom-hooks/use-add-new-conversation-dialog';
import AddNewConversationDialog from '../AddNewConversationDialog/AddNewConversationDialog';
import { Link } from 'react-router-dom';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';

interface Props {
  readonly standAlone?: boolean;
}

const ConversationsPreview = ({ standAlone = false }: Props) => {
  const dispatch = useAppDispatch();
  const [searchTerm, handleSearch] = useDebounceSearch();
  const previewError = useAppSelector(
    (state) => state.chat.conversationState.previewConversations.error,
  );
  const [open, openDialog, closeDialog, createConversation] =
    useAddNewConversationDialog();

  useRenderErrorMessage(previewError, setPreviewConversationError);

  const readAll = () => {
    dispatch(readAllConversation());
  };

  const path = standAlone ? '/' : '/chat';
  const icon = standAlone ? <FullscreenExitOutlined /> : <FullscreenOutlined />;

  return (
    <>
      <div className={styles.header}>
        <Typography.Title level={3}>Chats</Typography.Title>
        <div className={styles.buttons}>
          <AutoClosePopover
            content={
              <div className='more-action-box-container'>
                <Button type='text' block>
                  View restricted accounts
                </Button>
                <Button type='text' block>
                  View Preference
                </Button>
              </div>
            }
          >
            <Button type='text' icon={<MoreOutlined />} />
          </AutoClosePopover>
          <Link to={path}>
            <Button type='text' icon={icon} className={styles.button} />
          </Link>
          <Button
            type='text'
            icon={<PlusCircleOutlined />}
            className={styles.button}
            onClick={openDialog}
          />
        </div>
      </div>
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
      <ConversationPreviewList searchTerm={searchTerm} standAlone={standAlone} />
      <AddNewConversationDialog
        open={open}
        close={closeDialog}
        createConversation={createConversation}
      />
    </>
  );
};

export default ConversationsPreview;
