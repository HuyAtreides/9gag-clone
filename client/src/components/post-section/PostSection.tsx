import { Avatar, Typography } from 'antd';
import Section from '../../models/section';
import styles from './PostSection.module.css';
import { AvatarSize } from 'antd/lib/avatar/SizeContext';

interface Props {
  readonly section: Section;
  readonly avatarSize?: AvatarSize;
}

const PostSection: React.FC<Props> = ({ section, avatarSize = 20 }) => {
  return (
    <div className={styles.sectionItem} key={section.id}>
      <Avatar shape='square' src={section.imgUrl} size={avatarSize} />
      <Typography.Text
        className={styles.sectionName}
        ellipsis={{ symbol: '...' }}
        title={section.displayName}
      >
        {section.displayName}
      </Typography.Text>
    </div>
  );
};

export default PostSection;
