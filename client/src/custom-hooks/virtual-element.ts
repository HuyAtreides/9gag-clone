import React, { useEffect, useRef, useState } from 'react';

const useVirtualElement = (
  scrollAreaId: string,
): [boolean, React.MutableRefObject<null | HTMLDivElement>] => {
  const [isVisibleInViewPort, setIsVisibleInViewPort] = useState(true);
  const virtualItemRef = useRef<null | HTMLDivElement>(null);

  const callback: IntersectionObserverCallback = (entries, _) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      setIsVisibleInViewPort(true);
    } else if (!document.fullscreenElement) {
      setIsVisibleInViewPort(false);
    }
  };

  const intersectionObserverRef = useRef(
    new IntersectionObserver(callback, {
      root: document.querySelector(scrollAreaId),
    }),
  );

  useEffect(() => {
    if (virtualItemRef.current) {
      intersectionObserverRef.current.observe(virtualItemRef.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      intersectionObserverRef.current.disconnect();
    };
  }, [isVisibleInViewPort]);

  return [isVisibleInViewPort, virtualItemRef];
};

export default useVirtualElement;
