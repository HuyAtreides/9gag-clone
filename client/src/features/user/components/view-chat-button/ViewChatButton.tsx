import { Button } from 'antd';
import { useAppDispatch } from '../../../../Store';
import { createNewConversation } from '../../../../Store/chat/chat-dispatchers';
import { User } from '../../../../models/user';

interface Props {
  readonly user: User;
}

const ViewChatButton = ({ user }: Props) => {
  const dispatch = useAppDispatch();

  const viewChat = () => {
    dispatch(createNewConversation(user.id));
  };

  return (
    <Button type='text' onClick={viewChat}>
      View Chat
    </Button>
  );
};

export default ViewChatButton;
