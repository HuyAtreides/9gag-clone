import {
  CameraOutlined,
  CloseOutlined,
  MoreOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Row,
  Typography,
  Upload,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../../Store';
import GifSelect from '../../../../components/gif-select/GifSelect';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import useUploadFile from '../../../../custom-hooks/upload-file';
import { User } from '../../../../models/user';
import styles from './ChatBox.module.css';
import MessageGroup from './MessageGroup';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  readonly user: User;
}

const ChatBox = () => {
  const [uploadFile, handleFileChange] = useUploadFile(undefined);
  const currentUser = useAppSelector((state) => state.user.profile);

  return (
    <Card
      title={
        <List.Item.Meta
          avatar={
            <Avatar
              src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp'
              size={35}
            />
          }
          className={styles.chatBoxHeader}
          title={<Link to=''>Huy Phan</Link>}
          description={'huyPhan'}
        />
      }
      className={styles.chatBox}
      extra={[
        <Button icon={<MoreOutlined />} type='text' />,
        <Button icon={<CloseOutlined />} type='text' />,
      ]}
      actions={[
        <Form>
          <Row align='middle' justify='space-between'>
            <Col span={uploadFile ? 4 : 3}>
              <Form.Item name='file' className={styles.chatInputFormItem}>
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={uploadFile}
                  listType='picture'
                  onChange={handleFileChange}
                >
                  {uploadFile ? null : (
                    <Button icon={<CameraOutlined />} shape='default' />
                  )}
                </Upload>
              </Form.Item>
            </Col>

            {uploadFile ? null : (
              <Col span={3}>
                <Form.Item className={styles.chatInputFormItem}>
                  <GifSelect setGif={() => null} disabled={false} />
                </Form.Item>
              </Col>
            )}
            {uploadFile ? <Col span={2}></Col> : null}
            <Col span={15}>
              <FormItem className={styles.chatInputFormItem}>
                <Input className={styles.chatInput} placeholder='Message to Huy Phan' />
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem className={styles.chatInputFormItem}>
                <Button icon={<SendOutlined />} type='text' htmlType='submit' />
              </FormItem>
            </Col>
          </Row>
        </Form>,
      ]}
    >
      <InfiniteScroll
        hasMore={false}
        next={() => {}}
        dataLength={4}
        loader
        height={window.innerHeight * 0.45}
        className={styles.chatBoxContent}
      >
        <MessageGroup sender={currentUser || undefined} />
        <MessageGroup />
        <div className={styles.chatParticipantInfo}>
          <Avatar
            size={100}
            shape='circle'
            src='https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp'
          />
          <Typography.Title level={5}>
            <NameWithCountryFlag country={'Viet Nam'} name={'Huy Phan'} />
          </Typography.Title>
          <Typography.Text type='secondary'>Joined in 18/03/2024</Typography.Text>
        </div>
      </InfiniteScroll>
    </Card>
  );
};

export default ChatBox;
