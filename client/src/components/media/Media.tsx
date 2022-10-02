import { Image } from 'antd';
import { MediaType } from '../../models/enums/constant';
import { toEnum } from '../../utils/value-to-enum';
import styles from './Media.module.css';

interface Props {
  readonly url: string;
  readonly type: string;
  readonly width?: string;
  readonly height?: string;
}

const FORTY_FIVE_PERCENT = 45 / 100;

const Media: React.FC<Props> = ({ url, type, width, height }: Props) => {
  const mediaType = toEnum(type.split('/')[0], MediaType);

  if (mediaType === MediaType.Image) {
    return <Image src={url} width={width} height={height} className={styles['media']} />;
  }

  // eslint-disable-next-line no-restricted-globals
  const DEFAULT_MEDIA_WIDTH = screen.width * FORTY_FIVE_PERCENT;

  return (
    <video
      src={url}
      width={width ? width : DEFAULT_MEDIA_WIDTH}
      height={height}
      controls
      preload='auto'
    />
  );
};

export default Media;
