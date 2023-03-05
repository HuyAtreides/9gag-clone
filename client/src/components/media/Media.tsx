import { Image } from 'antd';
import React, { useEffect, useRef } from 'react';
import { MediaType } from '../../models/enums/constant';
import { toEnum } from '../../utils/value-to-enum';
import GifWrapper from '../gif-wrapper/GifWrapper';
import styles from './Media.module.css';

interface Props {
  readonly url: string;
  readonly type: string;
  readonly scrollAreaId: string;
  readonly width?: string | number;
  readonly height?: string | number;
}

const Media: React.FC<Props> = ({ url, type, width, height, scrollAreaId }: Props) => {
  const mediaType = toEnum(type.split('/')[0], MediaType);
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    return <Image src={url} width={width} height={height} className={className} />;
  }

  if (mediaType === MediaType.Gif) {
    return <GifWrapper mediaLocation={{ url, type }} />;
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
