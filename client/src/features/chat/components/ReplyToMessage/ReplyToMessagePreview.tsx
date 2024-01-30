import { Typography } from 'antd';
import ReplyToMessage from '../../../../models/reply-to-message';
import styles from './ReplyToMessagePreview.module.css';
import { getMediaTypeFromMIME } from '../../../../utils/mime-type';
import { MediaType } from '../../../../models/enums/constant';

interface Props {
  readonly message: ReplyToMessage;
}

const ReplyToMessagePreviewContent = ({ message }: Props) => {
  const { content } = message;
  const { mediaType } = content;

  if (message.deleted) {
    return <i>Message is deleted</i>;
  }

  if (content.text) {
    return <>{content.text}</>;
  }

  const type = getMediaTypeFromMIME(mediaType!);

  if (type === MediaType.Image) {
    return <i>[Image]</i>;
  }

  if (type === MediaType.Gif) {
    return <i>[GIF]</i>;
  }

  if (type === MediaType.File) {
    return <i>[File]</i>;
  }

  return <i>[Video]</i>;
};

const ReplyToMessagePreview = ({ message }: Props) => {
  return (
    <Typography.Paragraph
      type='secondary'
      className={styles.replyContentMessageContainer}
    >
      <blockquote className={styles.replyContentMessage} role='button'>
        <ReplyToMessagePreviewContent message={message} />
      </blockquote>
    </Typography.Paragraph>
  );
};

export default ReplyToMessagePreview;
