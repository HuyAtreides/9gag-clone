import { FormOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Typography, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../Store';
import { share } from '../../../Store/post/post-dispatchers';
import Post from '../../../models/post';
import PostSection from '../../post-section/PostSection';
import SharedPost from '../../shared-post/SharedPostContent';
import styles from './ShareToProfileButton.module.scss';

interface Props {
  readonly post: Post;
}

interface SharePostFormValue {
  readonly title: string;
  readonly section: string;
}

const ShareToProfileButton: React.FC<Props> = ({ post }) => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const sharedPostsState = useAppSelector((state) => state.post.sharedPosts);
  const sharedPostId = post.sharedPostId;
  const sharedPost = sharedPostId === null ? post : sharedPostsState[post.id].sharedPost;
  const sections = useAppSelector((state) => state.section.sections);
  const isSharingPost = useAppSelector((state) => state.post.isSharingPost);
  const [form] = useForm<SharePostFormValue>();
  const options = sections.map((section) => ({
    value: section.name,
    label: <PostSection section={section} key={section.id} />,
  }));

  const handleShare = async () => {
    const formValue = form.getFieldsValue();
    const selectedSection = sections.find(
      (section) => section.name === formValue.section,
    );

    if (!selectedSection) {
      message.error('Invalid section');
      return;
    }

    await dispatch(
      share({
        sharedPostId: post.id,
        ...formValue,
        section: selectedSection,
      }),
    );

    setShowModal(false);
  };

  if (!sharedPost) {
    return null;
  }

  return (
    <>
      <Button
        icon={<FormOutlined className={styles.icon} />}
        type='text'
        block
        onClick={() => setShowModal(true)}
        className={styles.iconContainer}
      >
        Share To Profile
      </Button>
      <Modal
        width='auto'
        confirmLoading={isSharingPost}
        title={
          <Typography.Text className={styles.modalTitle}>Write Post</Typography.Text>
        }
        centered
        onOk={handleShare}
        zIndex={10}
        visible={showModal}
        okText='Share'
        className={styles.sharePostModal}
        onCancel={() => setShowModal(false)}
      >
        <Form layout='vertical' form={form} disabled={isSharingPost}>
          <Form.Item name='section' label='Section'>
            <Select
              size='large'
              showSearch
              placeholder='Search to Select'
              optionFilterProp='children'
              filterOption={(input, option) => (option?.value ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.value ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.value ?? '').toLowerCase())
              }
              options={options}
            />
          </Form.Item>
          <Form.Item name='title'>
            <TextArea
              disabled={isSharingPost}
              autoSize
              placeholder='Enter your post title (optional)'
              size='large'
            />
          </Form.Item>
          <SharedPost sharedPost={sharedPost} />
        </Form>
      </Modal>
    </>
  );
};

export default ShareToProfileButton;
