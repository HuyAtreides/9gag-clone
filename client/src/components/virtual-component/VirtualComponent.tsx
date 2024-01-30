import { ReactNode } from 'react';
import useVirtualElement from '../../custom-hooks/virtual-element';

interface Props {
  readonly children: ReactNode;
  readonly scrollAreaId: string;
}

const VirtualComponent: React.FC<Props> = ({ children, scrollAreaId }) => {
  const [isVisibleInViewPort, virtualElementRef] = useVirtualElement(scrollAreaId);

  if (!isVisibleInViewPort) {
    return (
      <div
        ref={virtualElementRef}
        style={{ height: virtualElementRef.current?.offsetHeight }}
      ></div>
    );
  }

  return <div ref={virtualElementRef}>{children}</div>;
};

export default VirtualComponent;
