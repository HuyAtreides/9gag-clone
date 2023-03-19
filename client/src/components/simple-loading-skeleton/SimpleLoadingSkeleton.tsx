import { Skeleton } from 'antd';
import { ReactElement } from 'react';

interface Props {
  readonly isLoading: boolean;
  readonly component: ReactElement;
}

const SimpleLoadingSkeleton: React.FC<Props> = ({ isLoading, component }) => {
  if (isLoading) {
    return <Skeleton.Input active={true} size='small' />;
  }

  return component;
};

export default SimpleLoadingSkeleton;
