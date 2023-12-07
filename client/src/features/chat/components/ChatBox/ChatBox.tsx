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
import { useAppDispatch, useAppSelector } from '../../../../Store';
import GifSelect from '../../../../components/gif-select/GifSelect';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import useUploadFile from '../../../../custom-hooks/upload-file';
import { User } from '../../../../models/user';
import styles from './ChatBox.module.css';
import MessageGroup from './MessageGroup';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChatBoxSkeleton from './ChatBoxSkeleton';
import { closeConversation } from '../../../../Store/chat/chat-slice';

interface Props {
  readonly index: number;
}

const ChatBox = ({ index }: Props) => {
  const [uploadFile, handleFileChange] = useUploadFile(undefined);
  const dispatch = useAppDispatch();
  const openConversation = useAppSelector(
    (state) => state.chat.conversationState.openConversations[index],
  );
  const currentUser = useAppSelector((state) => state.user.profile);

  if (openConversation.isLoading) {
    return <ChatBoxSkeleton />;
  }

  const close = () => {
    dispatch(closeConversation(index));
  };

  const chatParticipants = openConversation.conversation?.participants;
  const chatParticipant = chatParticipants?.find(
    (participant) => participant.id !== currentUser?.id,
  );

  return (
    <Card
      title={
        <List.Item.Meta
          avatar={<Avatar src={chatParticipant?.avatarUrl} size={35} />}
          className={styles.chatBoxHeader}
          title={
            <Link to={`/user/${chatParticipant?.id}`}>
              {chatParticipant?.displayName}
            </Link>
          }
          description={chatParticipant?.username}
        />
      }
      className={styles.chatBox}
      extra={[
        <Button icon={<MoreOutlined />} type='text' />,
        <Button icon={<CloseOutlined />} type='text' onClick={close} />,
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
                <Input
                  className={styles.chatInput}
                  placeholder={`Message to ${chatParticipant?.displayName}`}
                />
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
        <MessageGroup sender={chatParticipant!} />
        <MessageGroup sender={currentUser!} />
        <div className={styles.chatParticipantInfo}>
          <Avatar size={100} shape='circle' src={chatParticipant?.avatarUrl} />
          <Typography.Title level={5}>
            <NameWithCountryFlag
              country={chatParticipant?.country || ''}
              name={chatParticipant?.displayName || ''}
            />
          </Typography.Title>
          <Typography.Text type='secondary'>{`Joined in ${chatParticipant?.created.toLocaleDateString()}`}</Typography.Text>
        </div>
      </InfiniteScroll>
    </Card>
  );
};

export default ChatBox;
