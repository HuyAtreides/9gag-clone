import React from 'react';
import { useAppSelector } from '../../../../Store';
import ParentComment from '../ParentComment/ParentComment';
import styles from './CommentList.module.css';

const CommentList: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.commentListContainer}>
      <ParentComment />
    </div>
  );
};

export default CommentList;
