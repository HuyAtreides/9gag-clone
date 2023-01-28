import { User } from '../../../../models/user';
import PostComment from '../PostComment/PostComment';

interface Props {
  readonly user: User;
}

const ChildComment: React.FC<Props> = ({ user }: Props) => {
  return <PostComment user={user} />;
};

export default ChildComment;
