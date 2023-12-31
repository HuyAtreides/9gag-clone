import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { closeConversation } from '../../../../Store/chat/chat-slice';
import AuthenticatedGuard from '../../../../components/component-guard/AuthenticatedGuard';
import { ScreenBreakPoint } from '../../../../models/enums/constant';
import ChatBox from '../ChatBox/ChatBox';
import styles from './ChatBoxQueue.module.css';

const ANT_DESIGN_GRID_COLUMNS = 24;

const getMaxOpenConversations = () => {
  const width = window.innerWidth;

  if (width >= ScreenBreakPoint.ExtraLarge) {
    return 3;
  }

  if (width >= ScreenBreakPoint.Large) {
    return 2;
  }

  return 1;
};

const ChatBoxQueue = () => {
  const dispatch = useAppDispatch();
  const openConversations = useAppSelector(
    (state) => state.chat.conversationState.openConversations,
  );

  useEffect(() => {
    const handleResize = () => {
      const maxOpenConversations = getMaxOpenConversations();
      const numberOfExceedOpenConversations =
        openConversations.length - maxOpenConversations;
      for (let i = numberOfExceedOpenConversations; i > 0; i--) {
        dispatch(closeConversation(openConversations[i].userId));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch, openConversations]);

  if (openConversations.length === 0) {
    return null;
  }

  return (
    <AuthenticatedGuard
      component={
        <Row gutter={17} className={styles.chatBoxQueue} justify='end' align='bottom'>
          {openConversations.map((openConversation) => (
            <Col
              span={ANT_DESIGN_GRID_COLUMNS / openConversations.length}
              key={openConversation.userId}
            >
              <ChatBox chatParticipantId={openConversation.userId} />
            </Col>
          ))}
        </Row>
      }
    />
  );
};

export default ChatBoxQueue;
