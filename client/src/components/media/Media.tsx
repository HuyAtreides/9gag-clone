import { Image } from 'antd';
import { useEffect, useRef } from 'react';
import { MediaType } from '../../models/enums/constant';
import { toEnum } from '../../utils/value-to-enum';
import styles from './Media.module.css';

interface Props {
  readonly url: string;
  readonly type: string;
  readonly scrollAreaId: string;
  readonly width?: string;
  readonly height?: string;
}

const SEVENTY_PERCENT = 70 / 100;
// eslint-disable-next-line no-restricted-globals
const DEFAULT_HEIGHT = screen.height * SEVENTY_PERCENT;

const Media: React.FC<Props> = ({ url, type, width, height, scrollAreaId }: Props) => {
  const mediaType = toEnum(type.split('/')[0], MediaType);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const observerCallback: IntersectionObserverCallback = (entries, _) => {
    const entry = entries[0];
    const video = entry.target as HTMLVideoElement;

    if (entry.isIntersecting) {
      video.play();
    } else {
      video.pause();
    }
  };

  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(observerCallback, {
      root: document.querySelector(scrollAreaId),
      threshold: 0.5,
    }),
  );

  useEffect(() => {
    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      observerRef.current.disconnect();
    };
  }, []);

  if (mediaType === MediaType.Image) {
    return (
      <Image
        src={url}
        width={width}
        height={height ? height : DEFAULT_HEIGHT}
        className={styles['media']}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={styles['media']}
      src={url}
      width={width}
      height={height ? height : DEFAULT_HEIGHT}
      controls
      preload='auto'
    />
  );
};

export default Media;
