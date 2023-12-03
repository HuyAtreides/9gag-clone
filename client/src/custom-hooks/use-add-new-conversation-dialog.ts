import { useState } from 'react';

type StateUpdateFunction = () => void;

const useAddNewConversationDialog = (): [
  boolean,
  StateUpdateFunction,
  StateUpdateFunction,
  StateUpdateFunction,
] => {
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const createConversation = () => {};

  return [open, openDialog, closeDialog, createConversation];
};

export default useAddNewConversationDialog;
