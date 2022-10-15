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

const SEVENTY_PERCENT = 70 / 100;
// eslint-disable-next-line no-restricted-globals
const DEFAULT_HEIGHT = screen.height * SEVENTY_PERCENT;

const Media: React.FC<Props> = ({ url, type, width, height }: Props) => {
  const mediaType = toEnum(type.split('/')[0], MediaType);

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
      src={url}
      width={width}
      height={height ? height : DEFAULT_HEIGHT}
      controls
      preload='auto'
    />
  );
};

export default Media;
