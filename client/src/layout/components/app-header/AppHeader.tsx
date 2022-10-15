import { BellOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, PageHeader, Typography } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../Store';
import styles from './AppHeader.module.css';

const AppHeader: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);

  return (
    <PageHeader
      className={styles.header}
      ghost={false}
      title={<Link to='/auth'>9GAG</Link>}
      subTitle='Go fun the world'
      extra={[
        <Button key='3' shape='circle' icon={<SearchOutlined />} />,
        <Button key='2' shape='circle' icon={<BellOutlined />} />,
        <Link to='/auth'>
          <Avatar src={user?.avatarUrl}></Avatar>
        </Link>,
        <Button type='primary' shape='round' icon={<UploadOutlined />} size='large'>
          Post
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default AppHeader;
