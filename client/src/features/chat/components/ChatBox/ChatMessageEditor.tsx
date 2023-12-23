import { CameraOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useAppDispatch } from '../../../../Store';
import GifSelect from '../../../../components/gif-select/GifSelect';
import useUploadFile from '../../../../custom-hooks/upload-file';
import ChatMessage from '../../../../models/chat-message';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
import styles from './ChatBox.module.css';

interface Props {
  readonly handleSubmit: (formData: NewChatMessageFormData) => void;
  readonly handleFocus?: () => void;
  readonly handleCancel?: () => void;
  readonly editMessage?: boolean;
  readonly disabled?: boolean;
  readonly message?: ChatMessage;
}

const ChatMessageEditor = ({
  handleSubmit,
  message,
  editMessage = false,
  handleFocus = () => {},
  handleCancel,
  disabled = false,
}: Props) => {
  const content = message?.content;
  const hasFile = content?.mediaUrl != null && content?.mediaType != null;
  const [uploadFile, handleFileChange, setUploadFile] = useUploadFile(
    hasFile
      ? {
          url: content.mediaUrl,
          type: content.mediaType,
        }
      : undefined,
  );
  const dispatch = useAppDispatch();
  const [form] = useForm<NewChatMessageFormData>();
  const singleUploadFile = uploadFile && uploadFile[0];

  const resetFormValue = () => {
    setUploadFile(undefined);
    form.resetFields();
  };

  const handleFormSubmit = (formData: NewChatMessageFormData) => {
    handleSubmit(formData);
    resetFormValue();
  };

  useEffect(() => {
    form.setFieldValue('file', singleUploadFile);
  }, [form, singleUploadFile]);

  return (
    <Form
      onFinish={handleFormSubmit}
      form={form}
      onFocusCapture={handleFocus}
      initialValues={{
        text: message?.content.text,
      }}
      disabled={disabled}
    >
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
              {uploadFile ? null : <Button icon={<CameraOutlined />} shape='default' />}
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
              autoFocus
              allowClear
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
    </Form>
  );
};

export default ChatMessageEditor;
