import { ReactNode } from 'react';
import ChatMessage from '../../../../models/chat-message';
import { Popover, Tooltip } from 'antd';

interface Props {
  readonly children: ReactNode;
  readonly placement: 'left' | 'right';
  readonly message: ChatMessage;
  readonly actionButtons: ReactNode;
}

interface MessageTooltipProps {
  readonly children: ReactNode;
  readonly placement: 'right' | 'left';
  readonly message: ChatMessage;
}

interface MessagePopoverProps {
  readonly actionButtons: ReactNode;
  readonly children: ReactNode;
  readonly placement: 'right' | 'left';
}

const MessageTooltip = ({ children, message, placement }: MessageTooltipProps) => {
  return (
    <Tooltip
      showArrow={false}
      placement={placement}
      zIndex={1}
      getPopupContainer={(container) => container.parentElement!}
      title={`Sent at ${message.sentDate.toLocaleString()} ${
        message.edited ? 'Edited' : ''
      }`}
    >
      {children}
    </Tooltip>
  );
};

const MessagePopover = ({ placement, actionButtons, children }: MessagePopoverProps) => {
  return (
    <Popover
      zIndex={2}
      placement={placement}
      getPopupContainer={(container) => container.parentElement!}
      content={<div className='more-action-box-container'>{actionButtons}</div>}
      trigger='click'
    >
      {children}
    </Popover>
  );
};

const ChatMessagePopover = ({ actionButtons, children, placement, message }: Props) => {
  if (message.deleted) {
    return <div>{children}</div>;
  }

  return (
    <MessageTooltip message={message} placement={placement}>
      <div>
        <MessagePopover placement={placement} actionButtons={actionButtons}>
          <div>{children}</div>
        </MessagePopover>
      </div>
    </MessageTooltip>
  );
};

export default ChatMessagePopover;
