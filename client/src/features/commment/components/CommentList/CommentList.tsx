import React from 'react';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import CommentEditor from '../../../../components/comment-editor/CommentEditor';
import { useAppSelector } from '../../../../Store';
import ParentComment from '../ParentComment/ParentComment';

const CommentList: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);

  if (!user) {
    return <CenterSpinner />;
  }

  return (
    <>
      <CommentEditor user={user} />
      <ParentComment user={user} />
      <ParentComment user={user} />
    </>
  );
};

export default CommentList;
