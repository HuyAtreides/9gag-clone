import InfiniteScroll from 'react-infinite-scroll-component';
import CenterSpinner from '../../../../components/center-spinner/CenterSpinner';
import { Avatar, Button, List } from 'antd';

const UserFollowers: React.FC<{ userId: number }> = ({ userId }) => {
  return (
    <List
      dataSource={[1, 2, 3, 4]}
      renderItem={(post, index) => (
        <List.Item actions={[<Button type='primary'>Following</Button>]}>
          <List.Item.Meta
            avatar={<Avatar src='' />}
            title={<a href='https://ant.design'>Follower name</a>}
            description='Display name'
          />
        </List.Item>
      )}
    />
  );
};

export default UserFollowers;
