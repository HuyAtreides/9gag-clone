import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const CenterSpinner: React.FC = () => {
  return (
    <div className='spinner-container'>
      <Spin size='large' indicator={<LoadingOutlined className='spinner' />} />
    </div>
  );
};

export default CenterSpinner;
