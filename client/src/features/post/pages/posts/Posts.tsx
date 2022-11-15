import { CaretDownOutlined, FileImageFilled, SearchOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  List,
  Row,
  Typography,
  Upload,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import useFormInstance from 'antd/lib/form/hooks/useFormInstance';
import { useState } from 'react';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import MediaLocation from '../../../../models/media-location';
import Section from '../../../../models/section';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { uploadNewPost } from '../../../../Store/post/post-dispatchers';
import { setPostErrorMessage } from '../../../../Store/post/post-slice';
import styles from './Post.module.scss';

const renderItem = (section: Section) => ({
  value: section.displayName,
  label: (
    <div className={styles.sectionItem} key={section.id}>
      <Avatar shape='square' src={section.imgUrl} />
      <Typography.Text className={styles.sectionName}>
        {section.displayName}
      </Typography.Text>
    </div>
  ),
  id: section.id,
});

const data = [
  '1. No pornography',
  '2. No violence or gory contents',
  '3. No hate speech and bullying',
  '4. No spamming and manipulation',
  '5. No deceptive content',
  '6. No illegal activities',
  '7. No impersonation',
  '8. No copyright infringement',
];

const Posts: React.FC = () => {
  const sections = useAppSelector((state) => state.section.sections!);
  const options = sections.map((section) => renderItem(section));
  const [selectedSection, setSelectedSection] = useState<Section | undefined>(undefined);
  const errorMessage = useAppSelector((state) => state.post.errorMessage);
  const isLoading = useAppSelector((state) => state.post.isLoading);
  const dispatch = useAppDispatch();

  useRenderErrorMessage(errorMessage, setPostErrorMessage);

  const onFinish = (value: any) => {
    if (selectedSection === undefined) {
      return;
    }

    dispatch(
      uploadNewPost({
        media: value.media.file,
        section: selectedSection,
        tags: value.tags,
        title: value.title,
      }),
    );
  };

  const handleSectionSelect = (_: string, option: any) => {
    setSelectedSection(sections.find((section) => section.id === option.id));
  };

  return (
    <div className={styles.postContainer}>
      <Row gutter={30}>
        <Col span={16}>
          <Form name='postForm' layout='vertical' onFinish={onFinish}>
            <Typography.Title className={styles.title}>Upload a post</Typography.Title>
            <Form.Item name='section' noStyle>
              <AutoComplete
                className={styles.sectionInput}
                options={options}
                filterOption={(value, option) =>
                  option?.value.match(new RegExp(`.*${value}.*`, 'i')) != null
                }
                onSelect={handleSectionSelect}
              >
                <Input
                  className={styles.searchInput}
                  size='large'
                  placeholder='Search...'
                  prefix={<SearchOutlined />}
                  suffix={<CaretDownOutlined />}
                />
              </AutoComplete>
            </Form.Item>
            <div className={styles.formContainer}>
              <Form.Item
                name='title'
                rules={[
                  {
                    required: true,
                    message: 'Please enter post title',
                  },
                ]}
              >
                <Input
                  className={styles.searchInput}
                  size='large'
                  placeholder='Title'
                  maxLength={280}
                />
              </Form.Item>
              <div className={styles.mediaContainer}>
                <Form.Item
                  name='media'
                  rules={[
                    {
                      required: true,
                      message: 'Please provide post media',
                    },
                  ]}
                >
                  <Upload
                    beforeUpload={() => false}
                    className={styles.upload}
                    maxCount={1}
                  >
                    <div className={styles.uploadWrapper}>
                      <FileImageFilled className={styles.icon} />
                      <Button type='primary' className={styles.btnSubmit}>
                        Choose file...
                      </Button>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
              <Form.Item name='tags'>
                <Input
                  className={styles.searchInput}
                  size='large'
                  placeholder='+ Add tags to help people find your post'
                />
              </Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className={styles.btnSubmit}
                loading={isLoading}
              >
                Submit post
              </Button>
            </div>
          </Form>
        </Col>
        <Col span={8}>
          <div className={styles.rulesContainer}>
            <List
              header={
                <Typography.Title className={styles.title}>9GAP Rules</Typography.Title>
              }
              split={false}
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text className={styles.text}>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Posts;
