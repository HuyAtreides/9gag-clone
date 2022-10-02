import { CaretDownOutlined, CaretUpOutlined, CommentOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Typography } from 'antd';
import { useState } from 'react';
import Media from '../../../../components/media/Media';
import useDownvote from '../../../../custom-hooks/downvote';
import useUpvote from '../../../../custom-hooks/upvote';
import Post from '../../../../models/post';
import { formatNumber } from '../../../../utils/format-number';
import styles from './PostContent.module.css';

interface Props {
  post: Post;
  index?: number;
}

const PostContent: React.FC<Props> = ({ post, index }: Props) => {
  const [upvoted, handleUpvote] = useUpvote();
  const [downvoted, handleDownvote] = useDownvote();

  return (
    <List.Item
      actions={[
        <Button icon={<CaretUpOutlined />} type={upvoted ? 'primary' : 'default'}>
          {formatNumber(post.upvotes)}
        </Button>,
        <Button icon={<CaretDownOutlined />} type={downvoted ? 'primary' : 'default'}>
          {formatNumber(post.downvotes)}
        </Button>,
        <Button icon={<CommentOutlined />}>{formatNumber(post.totalComments)}</Button>,
      ]}
      className={styles['post-content']}
    >
      <List.Item.Meta
        avatar={<Avatar src={post.section.imgUrl} />}
        title={
          <Typography.Link href='https://ant.design'>
            {post.section.displayName}
          </Typography.Link>
        }
        description={
          <Typography.Text>{post.uploadTime.toLocaleDateString()}</Typography.Text>
        }
      />
      <Typography.Title level={4}>{post.title}</Typography.Title>
      <Media type={post.mediaType} url={post.mediaUrl} />
    </List.Item>
  );
};

export default PostContent;
