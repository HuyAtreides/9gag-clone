import { Popover } from 'antd';
import { ReactNode, useState } from 'react';

interface Props {
  readonly placement?: 'top' | 'left' | 'bottom';
  readonly shouldScrollToTopAfterClicked?: boolean;
  readonly closeAfterClicked?: boolean;
  readonly content: ReactNode;
  readonly children: ReactNode;
}

const AutoClosePopover: React.FC<Props> = ({
  placement = 'bottom',
  shouldScrollToTopAfterClicked = false,
  closeAfterClicked = true,
  content,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handlePopoverClicked = () => {
    if (closeAfterClicked) {
      setOpen(false);
    }

    if (shouldScrollToTopAfterClicked) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <Popover
      trigger='click'
      placement={placement}
      visible={open}
      onVisibleChange={setOpen}
      content={
        <div className='more-action-box-container' onClick={handlePopoverClicked}>
          {content}
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default AutoClosePopover;
