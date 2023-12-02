import { Col, List, Row } from 'antd';
import ChatBox from '../ChatBox/ChatBox';
import styles from './ChatBoxQueue.module.css';

const ChatBoxQueue = () => {
  return (
    <Row gutter={16} className={styles.chatBoxQueue} justify='end' align='bottom'>
      <Col span={8}>
        <ChatBox />
      </Col>
      <Col span={8}>
        <ChatBox />
      </Col>
      <Col span={8}>
        <ChatBox />
      </Col>
    </Row>
  );
};

export default ChatBoxQueue;
