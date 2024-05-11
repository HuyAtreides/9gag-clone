import { Button, Empty, Image, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { MediaType } from '../../models/enums/constant';
import { getMediaTypeFromMIME } from '../../utils/mime-type';
import GifWrapper from '../gif-wrapper/GifWrapper';
import styles from './Media.module.css';
import useProtectedAction from '../../custom-hooks/protected-action';

interface Props {
  readonly url: string;
  readonly type: string;
  readonly scrollAreaId: string;
  readonly width?: string | number;
  readonly gifWidth?: number;
  readonly gifHeight?: number;
  readonly height?: string | number;
  readonly nsfw?: boolean;
}

const Media: React.FC<Props> = ({
  url,
  type,
  nsfw,
  width,
  height,
  scrollAreaId,
  gifHeight,
  gifWidth,
}: Props) => {
  const [showNSFW, setShowNSFW] = useState(false);
  const mediaType = getMediaTypeFromMIME(type);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const protectedAction = useProtectedAction();
  const className =
    width || height ? styles['media'] : `${styles['media']} ${styles['media-size']}`;
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
    if (!showNSFW && nsfw) {
      return (
        <Empty
          className={styles.nsfwMedia}
          image={<Typography.Title level={3}>Sensitive content</Typography.Title>}
          imageStyle={{ height: 'auto' }}
          description={
            <Typography.Text type='secondary'>
              The following media includes potentially sensitive content.
            </Typography.Text>
          }
        >
          <Button type='ghost' onClick={protectedAction(() => setShowNSFW(true))}>
            View
          </Button>
        </Empty>
      );
    }

    return <Image src={url} width={width} height={height} className={className} />;
  }

  if (mediaType === MediaType.Gif) {
    return (
      <GifWrapper
        mediaLocation={{ url, type, nsfw: false, moderating: false }}
        width={gifWidth}
        height={gifHeight}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      src={url}
      width={width}
      height={height}
      controls
      autoPlay
      preload='auto'
    />
  );
};

export default Media;
