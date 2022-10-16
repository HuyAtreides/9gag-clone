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
import Section from '../../../../models/section';
import { useAppSelector } from '../../../../Store';
import styles from './Post.module.scss';

const renderItem = ({ id, name, imgUrl, displayName }: Section) => ({
  value: name,
  label: (
    <div className={styles.sectionItem} key={id}>
      <Avatar shape='square' src={imgUrl} />
      <Typography.Text className={styles.sectionName}>{displayName}</Typography.Text>
    </div>
  ),
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

  const onFinish = (value: any) => {
    console.log(value);
  };

  return (
    <div className={styles.postContainer}>
      <Row gutter={30}>
        <Col span={16}>
          <Form name='postForm' layout='vertical' onFinish={onFinish}>
            <Typography.Title className={styles.title}>Upload a post</Typography.Title>
            <Form.Item name='section' noStyle>
              <AutoComplete className={styles.sectionInput} options={options}>
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
              <Form.Item name='title' noStyle>
                <Input
                  className={styles.searchInput}
                  size='large'
                  placeholder='Title'
                  maxLength={280}
                />
              </Form.Item>
              <div className={styles.mediaContainer}>
                <Form.Item name='media' noStyle>
                  <Upload action='/upload.do' className={styles.upload}>
                    <div className={styles.uploadWrapper}>
                      <FileImageFilled className={styles.icon} />
                      <Button type='primary' className={styles.btnSubmit}>
                        Choose file...
                      </Button>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
              <Form.Item name='tag' noStyle>
                <Input
                  className={styles.searchInput}
                  size='large'
                  placeholder='+ Add tags to help people find your post'
                />
              </Form.Item>
              <Button type='primary' htmlType='submit' className={styles.btnSubmit}>
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
