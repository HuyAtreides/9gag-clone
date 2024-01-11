import { Col, Empty, Row } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { closeConversation } from '../../../../Store/chat/chat-slice';
import ConversationsPreview from '../../components/ConversationsPreview/ConversationsPreview';
import StandAloneChatBox from '../../components/StandAloneChatBox/StandALoneChatBox';
import styles from './StandAloneChat.module.css';

const StandAloneChat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const openConversations = useAppSelector(
    (state) => state.chat.conversationState.openConversations,
  );
  const id = Number(conversationId);
  const selectedConversation = useAppSelector((state) =>
    state.chat.conversationState.openConversations.find(
      (openConversation) => openConversation.conversation?.id === id,
    ),
  )?.conversation;

  useEffect(() => {
    if (openConversations.length === 0) {
      return;
    }

    if (openConversations.length === 3) {
      dispatch(closeConversation(openConversations[2].userId));
      dispatch(closeConversation(openConversations[1].userId));
    } else if (openConversations.length === 2) {
      dispatch(closeConversation(openConversations[0].userId));
    }

    navigate(`/chat/${openConversations[0].conversation?.id}`);
  }, [openConversations, dispatch, navigate]);

  return (
    <Row className={styles.standaloneChatContainer}>
      <Col span={8} className={styles.conversationPreview}>
        <ConversationsPreview standAlone />
      </Col>
      <Col span={16}>
        {!selectedConversation ? (
          <Empty />
        ) : (
          <StandAloneChatBox conversation={selectedConversation} />
        )}
      </Col>
    </Row>
  );
};

export default StandAloneChat;
