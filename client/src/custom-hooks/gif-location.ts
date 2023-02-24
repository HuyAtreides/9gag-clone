import { useState } from 'react';
import MediaLocation from '../models/media-location';

const useUploadGif = (
  initialGifLocation: MediaLocation | undefined,
): [
  MediaLocation | undefined,
  React.Dispatch<React.SetStateAction<MediaLocation | undefined>>,
] => {
  const [gifLocation, setGifLocation] = useState<MediaLocation | undefined>(
    initialGifLocation,
  );

  return [gifLocation, setGifLocation];
};

export default useUploadGif;
