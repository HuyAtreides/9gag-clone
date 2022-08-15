import { Button, Typography } from 'antd';
import useProtectedAction from '../../../../custom-hooks/protected-action';
import { useAppSelector } from '../../../../Store';
import AuthContainer from '../../../auth/AuthContainer';

const Posts: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);
  const protectAction = useProtectedAction();

  return (
    <>
      <Typography.Title>{user ? user.username : 'Not authenticated'}</Typography.Title>
      <Button onClick={protectAction(() => void 0)}>Protected button</Button>

      <AuthContainer />
    </>
  );
};

export default Posts;
