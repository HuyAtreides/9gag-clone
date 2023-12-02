import { Affix, Button } from 'antd';
import styles from './ChatConversations.module.css';
import { PlusOutlined } from '@ant-design/icons';

const AffixAddConversationButton = () => {
  return (
    <Affix className={styles.affixAddConversationButton}>
      <Button
        icon={<PlusOutlined />}
        type='primary'
        title='Add new conversation'
        shape='circle'
        size='large'
      />
    </Affix>
  );
};

export default AffixAddConversationButton;
