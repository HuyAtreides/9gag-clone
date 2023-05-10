import { useState } from 'react';
import MediaLocation from '../models/media-location';
import { MediaType } from '../models/enums/constant';

const useUploadGif = (
  initialGifLocation: MediaLocation | undefined,
): [
  MediaLocation | undefined,
  React.Dispatch<React.SetStateAction<MediaLocation | undefined>>,
] => {
  const [gifLocation, setGifLocation] = useState<MediaLocation | undefined>(
    initialGifLocation?.type !== MediaType.Gif ? undefined : initialGifLocation,
  );

  return [gifLocation, setGifLocation];
};

export default useUploadGif;
