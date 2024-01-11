import { useAppSelector } from '../../../../Store';
import { ChatBoxHeight } from '../../../../context/chat-box-height';
import ChatConversation from '../../../../models/chat-conversation';
import ChatBox from '../ChatBox/ChatBox';

interface Props {
  readonly conversation: ChatConversation;
}

const StandAloneChatBox = ({ conversation }: Props) => {
  const currentUser = useAppSelector((state) => state.user.profile!);

  return (
    <ChatBoxHeight.Provider value='72vh'>
      <ChatBox chatParticipantId={conversation.getOtherParticipant(currentUser).id} />
    </ChatBoxHeight.Provider>
  );
};
export default StandAloneChatBox;
