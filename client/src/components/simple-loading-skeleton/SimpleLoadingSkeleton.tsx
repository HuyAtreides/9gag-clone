import { Skeleton } from 'antd';
import { ReactElement } from 'react';

interface Props {
  readonly isLoading: boolean;
  readonly component: ReactElement;
}

const SimpleLoadingSkeleton: React.FC<Props> = ({ isLoading, component }) => {
  if (isLoading) {
    <Skeleton.Input active={true} size='default' />;
  }

  return component;
};

export default SimpleLoadingSkeleton;
