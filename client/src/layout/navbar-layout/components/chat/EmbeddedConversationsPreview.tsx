import ConversationsPreview from '../../../../features/chat/components/ConversationsPreview/ConversationsPreview';
import styles from './EmbeddedConversationsPreview.module.css';

interface Props {
  readonly closePreview: () => void;
}

const EmbeddedConversationPreview = ({ closePreview }: Props) => {
  return (
    <div className={styles.conversationsPreviewContainer} onClick={closePreview}>
      <ConversationsPreview />
    </div>
  );
};

export default EmbeddedConversationPreview;
