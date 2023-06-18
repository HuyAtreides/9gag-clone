import { Avatar, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { Link } from 'react-router-dom';
import useTimeDiffFromToday from '../../custom-hooks/use-time-diff-from-today';
import { Constant } from '../../models/enums/constant';
import { PostContentType } from '../../models/enums/post-content-type';
import { SharedPost } from '../../models/shared-post';
import Media from '../media/Media';
import PostTitle from '../post-title/PostTitle';
import WYSIWYGView from '../wysiwyg-view/WYSIWYGView';
import styles from './SharedPostContent.module.css';

interface Props {
  readonly sharedPost: SharedPost;
}

const SharedPostContent: React.FC<Props> = ({ sharedPost }) => {
  const uploadTimeDiffFromToday = useTimeDiffFromToday(sharedPost.uploadTime);

  return (
    <Card
      cover={
        sharedPost.contentType === PostContentType.MEDIA ? (
          <Media
            type={sharedPost.mediaType}
            url={sharedPost.mediaUrl}
            scrollAreaId={Constant.PostScrollAreaId as string}
          />
        ) : null
      }
      className={styles.sharedPostContent}
    >
      <Meta
        avatar={<Avatar src={sharedPost.section.imgUrl} />}
        title={sharedPost.section.displayName}
        description={
          <>
            {`Uploaded by `}{' '}
            {!sharedPost.anonymous ? (
              <Link to={`/user/${sharedPost.user!.id}`}>{sharedPost.user!.username}</Link>
            ) : (
              'an anonymous user'
            )}{' '}
            &#8226; {uploadTimeDiffFromToday}
          </>
        }
        className={styles.sharedPostMeta}
      />
      <PostTitle title={sharedPost.title} />
      <WYSIWYGView content={sharedPost.text} />
    </Card>
  );
};

export default SharedPostContent;
