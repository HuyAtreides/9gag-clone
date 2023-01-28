import { Button } from 'antd';
import { User } from '../../../../models/user';
import ChildComment from '../ChildComment/ChildComment';
import PostComment from '../PostComment/PostComment';

interface Props {
  readonly user: User;
}

const ParentComment: React.FC<Props> = ({ user }: Props) => {
  return (
    <PostComment user={user}>
      <ChildComment user={user} />
      <ChildComment user={user} />
      <Button type='text'>More</Button>
    </PostComment>
  );
};

export default ParentComment;
