import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { readAllConversation } from '../../../../Store/chat/chat-dispatchers';
import { setPreviewConversationError } from '../../../../Store/chat/chat-slice';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import useAddNewConversationDialog from '../../../../custom-hooks/use-add-new-conversation-dialog';
import useDebounceSearch from '../../../../custom-hooks/use-debounce-search';
import AddNewConversationDialog from '../AddNewConversationDialog/AddNewConversationDialog';
import styles from './ConversationPreview.module.css';
import ConversationPreviewList from './ConversationsPreviewList';

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
                <Link to='/user/settings/restricting'>
                  <Button
                    type='text'
                    block
                    icon={<StopOutlined />}
                    className={styles.linkButton}
                  >
                    View restricted accounts
                  </Button>
                </Link>
                <Link to='/user/settings/account'>
                  <Button
                    type='text'
                    block
                    icon={<SettingOutlined />}
                    className={styles.linkButton}
                  >
                    View chat settings
                  </Button>
                </Link>
              </div>
            }
          >
            <Button
              type='text'
              icon={<MoreOutlined />}
              onClick={(event) => event.stopPropagation()}
            />
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
