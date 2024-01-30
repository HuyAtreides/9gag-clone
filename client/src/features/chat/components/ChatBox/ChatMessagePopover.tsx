import { ReactNode } from 'react';
import ChatMessage from '../../../../models/chat-message';
import { Button, Popover, Tooltip } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

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

const MessageTooltip = ({ children, message }: MessageTooltipProps) => {
  return (
    <Tooltip
      mouseEnterDelay={1}
      showArrow={false}
      placement='left'
      zIndex={2}
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
      mouseEnterDelay={0.3}
      zIndex={1}
      placement={placement}
      getPopupContainer={(container) => container.parentElement!}
      content={
        <Popover
          trigger='click'
          content={<div className='more-action-box-container'>{actionButtons}</div>}
        >
          <Button icon={<MoreOutlined />} type='text' />
        </Popover>
      }
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
