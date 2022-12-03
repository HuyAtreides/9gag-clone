import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styles from './Loading.module.scss';

interface Props {
  readonly size?: number | string;
}

const DEFAULT_SIZE = '5rem';

const Loading: React.FC<Props> = ({ size = DEFAULT_SIZE }: Props) => {
  return (
    <div className={styles.loadingContainer}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: size }} />} />
    </div>
  );
};

export default Loading;
