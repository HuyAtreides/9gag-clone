import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Gif } from '@giphy/react-components';
import { useEffect, useState } from 'react';
import { ComputedConstants } from '../../models/enums/constant';
import MediaLocation from '../../models/media-location';

const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIFPHY_API_KEY as string);

interface Props {
  mediaLocation: MediaLocation;
  width?: number;
}

const GifWrapper: React.FC<Props> = ({ mediaLocation, width }: Props) => {
  const [gif, setGif] = useState<IGif | null>(null);

  useEffect(() => {
    (async function () {
      const gifResult = await giphyFetch.gif(mediaLocation.url);
      setGif(gifResult.data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gif) {
    return null;
  }

  return (
    <Gif
      gif={gif}
      width={width || ComputedConstants.ScreenWidth * 0.1}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default GifWrapper;
