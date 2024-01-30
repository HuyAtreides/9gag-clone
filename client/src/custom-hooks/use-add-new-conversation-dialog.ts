import { useState } from 'react';
import { useAppDispatch } from '../Store';
import { createNewConversation } from '../Store/chat/chat-dispatchers';

type StateUpdateFunction = () => void;

const useAddNewConversationDialog = (): [
  boolean,
  StateUpdateFunction,
  StateUpdateFunction,
  (userId: number) => void,
] => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const createConversation = (userId: number) => {
    dispatch(createNewConversation(userId));
    setOpen(false);
  };

  return [open, openDialog, closeDialog, createConversation];
};

export default useAddNewConversationDialog;
