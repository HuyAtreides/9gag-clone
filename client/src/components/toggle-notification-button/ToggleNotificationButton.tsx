import { BellFilled, BellOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface Props {
  readonly notificationEnabled: boolean;
  readonly handleToggle: () => void;
}

const ToggleNotificationButton: React.FC<Props> = ({
  notificationEnabled,
  handleToggle,
}) => {
  return (
    <Button
      type='text'
      className='full-width-btn'
      icon={notificationEnabled ? <BellFilled /> : <BellOutlined />}
      onClick={handleToggle}
    >
      {notificationEnabled ? 'Turn off notifications' : 'Turn on notifications'}
    </Button>
  );
};

export default ToggleNotificationButton;
