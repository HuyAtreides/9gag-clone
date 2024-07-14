import {
  CaretDownOutlined,
  FileImageOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  List,
  Row,
  Tabs,
  Typography,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { uploadNewPost } from '../../../../Store/post/post-dispatchers';
import { setPostErrorMessage } from '../../../../Store/post/post-slice';
import DynamicTagList from '../../../../components/dynamic-tag-list/DynamicTagList';
import PostSection from '../../../../components/post-section/PostSection';
import WYSIWYGEditor from '../../../../components/wysiwyg-editor/WYSIWYGEditor';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import useUploadFile from '../../../../custom-hooks/upload-file';
import { PostContentType } from '../../../../models/enums/post-content-type';
import Section from '../../../../models/section';
import styles from './Post.module.scss';

const renderItem = (section: Section) => ({
  value: section.displayName,
  label: <PostSection section={section} key={section.id} />,
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
  const [uploadFile, handleFileChange] = useUploadFile();
  const [contentType, setContentType] = useState(PostContentType.MEDIA);
  const dispatch = useAppDispatch();

  useRenderErrorMessage(errorMessage, setPostErrorMessage);

  const onFinish = (value: any) => {
    if (selectedSection === undefined) {
      return;
    }

    dispatch(
      uploadNewPost({
        media: value.media?.file,
        section: selectedSection,
        tags: value.tags,
        title: value.title,
        text: value.text,
        contentType: contentType,
        anonymous: value.anonymous,
        notificationEnabled: value.notificationEnabled,
        followersOnly: value.followersOnly,
      }),
    );
  };

  const handleSectionSelect = (_: string, option: any) => {
    setSelectedSection(sections.find((section) => section.id === option.id));
  };

  return (
    <Row gutter={[0, 16]} className={styles.postContainer} justify='space-around'>
      <Col lg={14} xs={24}>
        <Form name='postForm' layout='vertical' onFinish={onFinish} disabled={isLoading}>
          <Typography.Title className={styles.title}>Upload a post</Typography.Title>
          <Form.Item
            name='section'
            rules={[
              {
                required: true,
                message: 'Please select post section',
              },
            ]}
          >
            <AutoComplete
              className={styles.sectionInput}
              options={options}
              filterOption={(value, option) =>
                option?.value.match(new RegExp(`.*${value}.*`, 'i')) != null
              }
              onChange={handleSectionSelect}
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
            <Form.Item name='title'>
              <TextArea
                className={styles.searchInput}
                size='large'
                placeholder='Enter your post title (optional)'
                autoSize
              />
            </Form.Item>
            <Tabs
              size='large'
              type='card'
              activeKey={contentType}
              onChange={(key) => setContentType(key as PostContentType)}
            >
              <Tabs.TabPane
                key={PostContentType.MEDIA}
                tab={
                  <>
                    <FileImageOutlined />
                    Image & Video
                  </>
                }
              >
                <div className={styles.mediaContainer}>
                  {contentType === PostContentType.MEDIA && (
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
                        fileList={uploadFile}
                        onChange={handleFileChange}
                        listType='picture-card'
                      >
                        <div>
                          <PlusOutlined />
                          <p>Upload</p>
                        </div>
                      </Upload>
                    </Form.Item>
                  )}
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                key={PostContentType.TEXT}
                tab={
                  <>
                    <FileTextOutlined />
                    Text
                  </>
                }
              >
                <Form.Item name='text'>
                  <WYSIWYGEditor />
                </Form.Item>
              </Tabs.TabPane>
            </Tabs>

            <Form.Item name='tags'>
              <DynamicTagList />
            </Form.Item>
            <Form.Item
              name='anonymous'
              valuePropName='checked'
              extra='When you enable anonymous posting, people will not see who is the owner of this post.'
            >
              <Checkbox>Enable anonymous posting</Checkbox>
            </Form.Item>
            <Form.Item
              name='followersOnly'
              valuePropName='checked'
              extra='Only followers can view your post.'
            >
              <Checkbox>Followers only</Checkbox>
            </Form.Item>
            <Form.Item
              name='notificationEnabled'
              valuePropName='checked'
              initialValue={true}
              extra='When you enable notifications, you will receive notifications when someone votes or comments to this post.'
            >
              <Checkbox>Enable notifications</Checkbox>
            </Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className={styles.btnSubmit}
              loading={isLoading}
              disabled={isLoading}
            >
              Submit post
            </Button>
          </div>
        </Form>
      </Col>
      <Col lg={8} xs={24}>
        <div className={styles.rulesContainer}>
          <List
            header={
              <Typography.Title className={styles.title}>9GAG Rules</Typography.Title>
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
  );
};

export default Posts;
