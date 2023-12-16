import {
  CameraOutlined,
  CloseOutlined,
  MoreOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Input, List, Row, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { addNewMessage, readConversation } from '../../../../Store/chat/chat-dispatchers';
import { closeConversation } from '../../../../Store/chat/chat-slice';
import GifSelect from '../../../../components/gif-select/GifSelect';
import useUploadFile from '../../../../custom-hooks/upload-file';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
import styles from './ChatBox.module.css';
import ChatBoxSkeleton from './ChatBoxSkeleton';
import ChatBoxWithError from './ChatBoxWithError';
import ChatMessageList from './ChatMessagesList';

interface Props {
  readonly chatParticipantId: number;
}

const ChatBox = ({ chatParticipantId }: Props) => {
  const [uploadFile, handleFileChange, setUploadFile] = useUploadFile(undefined);
  const dispatch = useAppDispatch();
  const [form] = useForm<NewChatMessageFormData>();
  const openConversation = useAppSelector((state) =>
    state.chat.conversationState.openConversations.find(
      (conversation) => conversation.userId === chatParticipantId,
    ),
  )!;
  const currentUser = useAppSelector((state) => state.user.profile!);

  if (openConversation.isLoading) {
    return <ChatBoxSkeleton />;
  }

  if (openConversation.error) {
    return (
      <ChatBoxWithError
        userId={chatParticipantId}
        errorMessage={openConversation.error}
      />
    );
  }

  const conversationId = openConversation.conversation!.id;
  const close = () => {
    dispatch(closeConversation(chatParticipantId));
  };

  const handleSubmit = (values: NewChatMessageFormData) => {
    resetFormValue();
    dispatch(addNewMessage(conversationId, values));
  };

  const resetFormValue = () => {
    setUploadFile(undefined);
    form.resetFields();
  };

  const markAsRead = () => {
    dispatch(readConversation(conversationId));
  };

  const chatParticipant = openConversation.conversation!.getOtherParticipant(currentUser);

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
        <Form onFinish={handleSubmit} form={form} onFocusCapture={markAsRead}>
          <Row align='middle' justify='space-between'>
            <Col span={uploadFile ? 5 : 3}>
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
            {uploadFile ? <Col span={1}></Col> : null}
            <Col span={uploadFile ? 13 : 15}>
              <FormItem className={styles.chatInputFormItem} name='text'>
                <Input.TextArea
                  rows={1}
                  autoSize={{ maxRows: 3 }}
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
      <ChatMessageList openConversation={openConversation.conversation!} />
    </Card>
  );
};

export default ChatBox;
