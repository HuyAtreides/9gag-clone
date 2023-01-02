import { CaretDownOutlined, CaretUpOutlined, CommentOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Typography } from 'antd';
import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Media from '../../../../components/media/Media';
import useDownvote from '../../../../custom-hooks/downvote';
import useProtectedAction from '../../../../custom-hooks/protected-action';
import useUpvote from '../../../../custom-hooks/upvote';
import VotePostActionExecutor from '../../../../custom-hooks/vote-action-executor/vote-post-action-executor';
import { Constant } from '../../../../models/enums/constant';
import Post from '../../../../models/post';
import { useAppDispatch } from '../../../../Store';
import { formatNumber } from '../../../../utils/format-number';
import styles from './PostContent.module.css';

interface Props {
  post: Post;
  index?: number;
}

const PostContent: React.FC<Props> = ({ post, index }: Props) => {
  const [upvoted, downvoted] = [post.isUpvoted, post.isDownvoted];
  const dispatch = useAppDispatch();
  const votePostExecutorRef = useRef(new VotePostActionExecutor(dispatch, index));
  const handleUpvote = useUpvote(post, votePostExecutorRef.current);
  const handleDownvote = useDownvote(post, votePostExecutorRef.current);
  const protectAction = useProtectedAction();
  const { tag } = useParams();

  return (
    <List.Item
      actions={[
        <Button
          icon={<CaretUpOutlined />}
          type={upvoted ? 'primary' : 'default'}
          onClick={protectAction(handleUpvote)}
        >
          {formatNumber(post.upvotes)}
        </Button>,
        <Button
          icon={<CaretDownOutlined />}
          type={downvoted ? 'primary' : 'default'}
          onClick={protectAction(handleDownvote)}
        >
          {formatNumber(post.downvotes)}
        </Button>,
        <Button icon={<CommentOutlined />}>{formatNumber(post.totalComments)}</Button>,
      ]}
      className={styles['post-content']}
    >
      <List.Item.Meta
        avatar={<Avatar src={post.section.imgUrl} />}
        title={
          <Link to={`/tag/${tag}/${post.section.name}`}>
            <Typography.Link>{post.section.displayName}</Typography.Link>
          </Link>
        }
        description={
          <Typography.Text>{post.uploadTime.toLocaleDateString()}</Typography.Text>
        }
      />
      <Typography.Title level={4}>{post.title}</Typography.Title>
      <Media
        type={post.mediaType}
        url={post.mediaUrl}
        scrollAreaId={Constant.PostScrollAreaId as string}
      />
    </List.Item>
  );
};

export default PostContent;
