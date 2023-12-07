import { Avatar, Typography } from 'antd';
import styles from './ChatBox.module.css';
import { User } from '../../../../models/user';
import { useAppSelector } from '../../../../Store';

interface Props {
  readonly sender: User;
}

const CurrentUserMessage = () => {
  return <Typography.Text className={styles.message}>Hello</Typography.Text>;
};

const OtherUserMessage = () => {
  return (
    <div className={styles.otherMessageContainer}>
      <Avatar
        size={30}
        shape='circle'
        src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp'
      />
      <Typography.Text className={styles.otherMessage}>Hello</Typography.Text>
    </div>
  );
};

const MessageGroup = ({ sender }: Props) => {
  const currentUser = useAppSelector((state) => state.user.profile);

  if (currentUser?.id === sender?.id) {
    return (
      <div className={styles.currentUserMessagesGroup}>
        <CurrentUserMessage />
        <CurrentUserMessage />
        <CurrentUserMessage />
        <CurrentUserMessage />
        <Avatar
          size={15}
          className={styles.messageStatus}
          shape='circle'
          src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp'
        />
        {/* <Typography.Text type='secondary' className={styles.messageStatus}>
          Sent
        </Typography.Text> */}
      </div>
    );
  }

  return (
    <div className={styles.otherUserMessagesGroup}>
      <OtherUserMessage />
      <OtherUserMessage />
      <OtherUserMessage />
      <OtherUserMessage />
      <OtherUserMessage />
    </div>
  );
};

export default MessageGroup;
