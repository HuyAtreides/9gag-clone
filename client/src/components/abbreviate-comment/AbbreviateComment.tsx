import { FileImageFilled, VideoCameraFilled } from '@ant-design/icons';
import { Avatar, Comment, Typography } from 'antd';
import { Link } from 'react-router-dom';
import AppComment from '../../models/comment';
import { MediaType } from '../../models/enums/constant';
import NameWithCountryFlag from '../name-with-country-flag/NameWithCountryFlag';
import useTimeDiffFromToday from '../../custom-hooks/use-time-diff-from-today';

interface Props {
  readonly comment: AppComment;
}

const CommentContent: React.FC<{ comment: AppComment }> = ({ comment }) => {
  if (!comment.text && comment.mediaType) {
    return (
      <Typography.Paragraph
        ellipsis={{
          rows: 17,
          expandable: false,
        }}
        strong
        italic
      >
        {`Comment with ${comment.mediaType === MediaType.Video ? 'a video' : 'an image'}`}{' '}
        {comment.mediaType === MediaType.Video ? (
          <VideoCameraFilled />
        ) : (
          <FileImageFilled />
        )}
      </Typography.Paragraph>
    );
  }

  return (
    <Typography.Paragraph
      ellipsis={{
        rows: 17,
        expandable: false,
      }}
    >
      {comment.text}
    </Typography.Paragraph>
  );
};

const getCommentUrl = (comment: AppComment) => {
  const url = new URL(`post/${comment.postId}`, process.env.REACT_APP_APP_URL);
  url.searchParams.append('commentId', comment.id as unknown as string);

  if (comment.replyToId) {
    url.searchParams.append('replyToId', comment.replyToId as unknown as string);
  }

  if (comment.parentId) {
    url.searchParams.append('parentId', comment.parentId as unknown as string);
  }

  return url.pathname + url.search;
};

const AbbreviateComment: React.FC<Props> = ({ comment }) => {
  const commentDateDiff = useTimeDiffFromToday(comment.date);
  return (
    <Link to={getCommentUrl(comment)}>
      <Comment
        author={
          <NameWithCountryFlag
            name={comment.user.username}
            country={comment.user.country || undefined}
          />
        }
        avatar={<Avatar src={comment.user.avatarUrl} alt='Han Solo' />}
        content={<CommentContent comment={comment} />}
        datetime={<span>&#8226; {commentDateDiff}</span>}
      />
    </Link>
  );
};

export default AbbreviateComment;
