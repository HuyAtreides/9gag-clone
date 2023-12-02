import ConversationsPreview from '../../../../features/chat/components/ConversationsPreview/ConversationsPreview';
import styles from './EmbeddedConversationsPreview.module.css';

const EmbeddedConversationPreview = () => {
  return (
    <div className={styles.conversationsPreviewContainer}>
      <ConversationsPreview />
    </div>
  );
};

export default EmbeddedConversationPreview;
