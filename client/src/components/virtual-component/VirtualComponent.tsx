import { ReactNode, useEffect, useRef } from 'react';
import useVirtualElement from '../../custom-hooks/virtual-element';

interface Props {
  readonly children: ReactNode;
  readonly scrollAreaId: string;
}

const VirtualComponent: React.FC<Props> = ({ children, scrollAreaId }) => {
  const [isVisibleInViewPort, virtualElementRef] = useVirtualElement(scrollAreaId);
  const contentHeight = useRef<number>(0);

  useEffect(() => {
    if (isVisibleInViewPort && virtualElementRef.current) {
      contentHeight.current = virtualElementRef.current.offsetHeight;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisibleInViewPort]);

  if (!isVisibleInViewPort) {
    return <div ref={virtualElementRef} style={{ height: contentHeight.current }}></div>;
  }

  return <div ref={virtualElementRef}>{children}</div>;
};

export default VirtualComponent;
