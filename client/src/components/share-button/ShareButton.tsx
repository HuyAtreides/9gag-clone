import { ShareAltOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import styles from './ShareButton.module.scss';
import Post from '../../models/post';

const ShareButton: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Popover
      getPopupContainer={(container) => container.parentElement!}
      trigger='click'
      showArrow={false}
      content={
        <div className='more-action-box-container'>
          <FacebookShareButton
            url={`${process.env.REACT_APP_APP_URL}/post/${post.id}`}
            children={
              <Button
                type='text'
                block
                className={styles.iconContainer}
                icon={<FacebookIcon size={20} round />}
              >
                &nbsp; Facebook
              </Button>
            }
          />
          <RedditShareButton
            children={
              <Button
                icon={<RedditIcon size={20} round />}
                type='text'
                block
                className={styles.iconContainer}
              >
                &nbsp; Reddit
              </Button>
            }
            url={`${process.env.REACT_APP_APP_URL}/post/${post.id}`}
          />
          <FacebookMessengerShareButton
            children={
              <Button
                icon={<FacebookMessengerIcon size={20} round />}
                type='text'
                block
                className={styles.iconContainer}
              >
                &nbsp; Messenger
              </Button>
            }
            appId={process.env.REACT_APP_FACEBOOK_API_ID as string}
            url={`${process.env.REACT_APP_APP_URL}/post/${post.id}`}
          />
          <TwitterShareButton
            children={
              <Button
                icon={<TwitterIcon size={20} round />}
                type='text'
                block
                className={styles.iconContainer}
              >
                &nbsp; Twitter
              </Button>
            }
            url={`${process.env.REACT_APP_APP_URL}/post/${post.id}`}
          />
        </div>
      }
    >
      <Button icon={<ShareAltOutlined />} type='text' className={styles.shareButton}>
        Share
      </Button>
    </Popover>
  );
};

export default ShareButton;
