import { Skeleton } from 'antd';
import styles from './PostSkeleton.module.scss';

const PostSkeleton: React.FC = () => {
  return (
    <div className={styles['skeleton-container']}>
      <br />
      <Skeleton avatar paragraph={{ rows: 0 }} active />
      <Skeleton.Image active className={styles['skeleton-image']} />

      <div className={styles['skeleton-button-container']}>
        <Skeleton.Button
          active
          block
          size='large'
          className={styles['skeleton-button']}
        />
        <Skeleton.Button
          active
          block
          size='large'
          className={styles['skeleton-button']}
        />
        <Skeleton.Button
          active
          block
          size='large'
          className={styles['skeleton-button']}
        />
      </div>
    </div>
  );
};

export default PostSkeleton;
