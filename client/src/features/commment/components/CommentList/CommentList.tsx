import React from 'react';
import { useAppSelector } from '../../../../Store';
import ParentComment from '../ParentComment/ParentComment';

const CommentList: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);

  if (!user) {
    return null;
  }

  return <ParentComment user={user} />;
};

export default CommentList;
