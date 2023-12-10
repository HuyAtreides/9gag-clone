import {
  CameraOutlined,
  CloseOutlined,
  MoreOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Input, List, Row, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { closeConversation } from '../../../../Store/chat/chat-slice';
import GifSelect from '../../../../components/gif-select/GifSelect';
import useUploadFile from '../../../../custom-hooks/upload-file';
import styles from './ChatBox.module.css';
import ChatBoxSkeleton from './ChatBoxSkeleton';
import ChatBoxWithError from './ChatBoxWithError';
import ChatMessageList from './ChatMessagesList';

interface Props {
  readonly index: number;
}

const ChatBox = ({ index }: Props) => {
  const [uploadFile, handleFileChange] = useUploadFile(undefined);
  const dispatch = useAppDispatch();
  const openConversation = useAppSelector(
    (state) => state.chat.conversationState.openConversations[index],
  );
  const currentUser = useAppSelector((state) => state.user.profile!);

  if (openConversation.isLoading) {
    return <ChatBoxSkeleton />;
  }

  if (openConversation.error) {
    return <ChatBoxWithError index={index} errorMessage={openConversation.error} />;
  }

  const close = () => {
    dispatch(closeConversation(index));
  };

  const chatParticipant = openConversation.conversation?.getOtherParticipant(currentUser);

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
          <Row align='bottom' justify='space-between'>
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
                <Input.TextArea
                  autoSize={{ maxRows: 3, minRows: 1 }}
                  className={styles.chatInput}
                  placeholder='Send message'
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
      <ChatMessageList openConversationIndex={index} />
    </Card>
  );
};

export default ChatBox;
