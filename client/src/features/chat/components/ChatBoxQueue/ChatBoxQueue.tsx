import { Col, List, Row } from 'antd';
import ChatBox from '../ChatBox/ChatBox';
import styles from './ChatBoxQueue.module.css';
import { useAppSelector } from '../../../../Store';

const ANT_DESIGN_GRID_COLUMNS = 24;

const ChatBoxQueue = () => {
  const openConversations = useAppSelector(
    (state) => state.chat.conversationState.openConversations,
  );

  if (openConversations.length === 0) {
    return null;
  }

  return (
    <Row gutter={16} className={styles.chatBoxQueue} justify='end' align='bottom'>
      {openConversations.map((_, index) => (
        <Col span={ANT_DESIGN_GRID_COLUMNS / openConversations.length}>
          <ChatBox key={index} index={index} />
        </Col>
      ))}
    </Row>
  );
};

export default ChatBoxQueue;
