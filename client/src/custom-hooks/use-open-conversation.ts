import { useAppSelector } from '../Store';

const useOpenConversation = (conversationId: number) => {
  const conversation = useAppSelector(
    (state) =>
      state.chat.conversationState.openConversations.find(
        (openConversation) => openConversation.conversation?.id === conversationId,
      )?.conversation,
  );

  if (conversation == null) {
    throw new Error('Invalid conversation id');
  }

  return conversation;
};

export default useOpenConversation;
