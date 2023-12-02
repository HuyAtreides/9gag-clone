import { Col, List, Row } from 'antd';
import ChatBox from '../ChatBox/ChatBox';
import styles from './ChatBoxQueue.module.css';

const ANT_DESIGN_GRID_COLUMNS = 24;

const ChatBoxQueue = () => {
  const openConversations = [1];

  return (
    <Row gutter={16} className={styles.chatBoxQueue} justify='end' align='bottom'>
      {openConversations.map((conversation) => (
        <Col span={ANT_DESIGN_GRID_COLUMNS / openConversations.length}>
          <ChatBox />
        </Col>
      ))}
    </Row>
  );
};

export default ChatBoxQueue;
