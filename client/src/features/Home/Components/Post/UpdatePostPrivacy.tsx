import { Modal, Radio, RadioChangeEvent, Space, Typography } from 'antd';
import Post from '../../../../models/post';
import { useState } from 'react';
import { useAppDispatch } from '../../../../Store';
import {
  setFollowersOnly,
  unsetFollowersOnly,
} from '../../../../Store/post/post-dispatchers';

interface Props {
  readonly open: boolean;
  readonly close: () => void;
  readonly post: Post;
}

const UpdatePostPrivacy = ({ open, close, post }: Props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(post.followersOnly);

  const handleSelect = (event: RadioChangeEvent) => {
    setValue(event.target.value);
  };

  const updatePostPrivacy = () => {
    if (value === post.followersOnly) {
      close();
      return;
    }

    if (value) {
      dispatch(setFollowersOnly(post));
    } else {
      dispatch(unsetFollowersOnly(post));
    }
    close();
  };

  return (
    <Modal
      visible={open}
      onCancel={close}
      title={<Typography.Title level={3}>Edit Post Privacy</Typography.Title>}
      okText='Update'
      onOk={updatePostPrivacy}
    >
      <Typography.Title level={4}>Select you can view your post</Typography.Title>
      <Radio.Group onChange={handleSelect} value={value}>
        <Space direction='vertical'>
          <Radio value={false}>Everyone</Radio>
          <Radio value={true}>Followers</Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
};

export default UpdatePostPrivacy;
