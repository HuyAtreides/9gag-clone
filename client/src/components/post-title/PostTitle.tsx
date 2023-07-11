import { Typography } from 'antd';

const PostTitle: React.FC<{ title?: string }> = ({ title }) => {
  if (title && title.trim().length) {
    return <Typography.Title level={4}>{title}</Typography.Title>;
  }

  return null;
};

export default PostTitle;
