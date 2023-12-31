import {
  CameraOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import GifSelect from '../../../../components/gif-select/GifSelect';
import useUploadFile from '../../../../custom-hooks/upload-file';
import ChatMessage from '../../../../models/chat-message';
import { Constant } from '../../../../models/enums/constant';
import MediaLocation from '../../../../models/media-location';
import { NewChatMessageFormData } from '../../../../models/new-chat-message-form-data';
import { isFileType } from '../../../../utils/mime-type';
import styles from './ChatBox.module.css';

const isOnlyEnterKeyPressed = (event: React.KeyboardEvent) => {
  return event.key === Constant.SubmitKey && !event.shiftKey;
};

const preventNewLineWhenPressEnter = (
  event: React.KeyboardEvent<HTMLTextAreaElement>,
) => {
  if (isOnlyEnterKeyPressed(event)) {
    event.preventDefault();
  }
};

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
  handleCancel = () => {},
  disabled = false,
}: Props) => {
  const content = message?.content;
  const hasFile = content?.mediaUrl != null && content?.mediaType != null;
  const [uploadFile, handleFileChange, setUploadFile] = useUploadFile(
    hasFile
      ? {
          url: content.mediaUrl,
          type: content.mediaType,
          originalFileName:
            content.uploadFile?.name || content.uploadFile?.originFileObj?.name,
        }
      : undefined,
  );
  const [focus, setFocus] = useState(false);
  const [form] = useForm<NewChatMessageFormData>();
  const singleUploadFile = uploadFile && uploadFile[0];
  const isFile = isFileType(singleUploadFile?.type);

  const handlePressEnter = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (focus && isOnlyEnterKeyPressed(event)) {
      form.submit();
    }
  };

  const resetFormValue = () => {
    setUploadFile(undefined);
    form.resetFields();
  };

  const handleFormFocus = () => {
    setFocus(true);
    handleFocus();
  };

  const handleFormSubmit = (formData: NewChatMessageFormData) => {
    handleSubmit(formData);
    resetFormValue();
    handleCancel();
  };

  const sendGif = (gif: MediaLocation) => {
    handleSubmit({
      text: undefined,
      file: {
        uid: gif.url,
        name: '',
        url: gif.url,
        type: gif.type,
      },
    });
    handleCancel();
  };

  useEffect(() => {
    form.setFieldValue('file', singleUploadFile);
  }, [form, singleUploadFile]);

  if (editMessage) {
    return (
      <Form
        onFinish={handleFormSubmit}
        form={form}
        onKeyUpCapture={handlePressEnter}
        onFocusCapture={handleFormFocus}
        onBlurCapture={() => setFocus(false)}
        initialValues={{
          text: message?.content.text,
        }}
        className={styles.editMessageForm}
        disabled={disabled}
      >
        <Row
          align='middle'
          justify='space-between'
          className={styles.editMessageTextarea}
        >
          <Col span={24}>
            <FormItem className={styles.chatInputFormItem} name='text'>
              <Input.TextArea
                autoFocus
                onPressEnter={preventNewLineWhenPressEnter}
                allowClear
                rows={1}
                autoSize={{ maxRows: 3 }}
                className={styles.chatInput}
                placeholder='Send message'
              />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={9}>
            <Row gutter={[5, 5]}>
              <Col>
                <Form.Item name='file' className={styles.chatInputFormItem}>
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    fileList={uploadFile}
                    listType={isFile ? 'text' : 'picture'}
                    onChange={handleFileChange}
                  >
                    {uploadFile ? null : (
                      <Button icon={<CameraOutlined />} shape='default' />
                    )}
                  </Upload>
                </Form.Item>
              </Col>

              {uploadFile ? null : (
                <Col>
                  <Form.Item className={styles.chatInputFormItem}>
                    <GifSelect setGif={sendGif} disabled={false} />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Col>

          <Col span={15}>
            <Button type='text' icon={<CloseOutlined />} onClick={handleCancel} />
            <Button type='text' icon={<CheckOutlined />} htmlType='submit' />
          </Col>
        </Row>
      </Form>
    );
  }

  return (
    <Form
      onFinish={handleFormSubmit}
      form={form}
      onFocusCapture={handleFormFocus}
      onKeyUpCapture={handlePressEnter}
      onBlurCapture={() => setFocus(false)}
      initialValues={{
        text: message?.content.text,
      }}
      disabled={disabled}
    >
      <Row align='middle' justify='space-between'>
        <Col span={uploadFile ? (isFile ? 7 : 5) : 3}>
          <Form.Item name='file' className={styles.chatInputFormItem}>
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={uploadFile}
              listType={isFile ? 'text' : 'picture'}
              onChange={handleFileChange}
            >
              {uploadFile ? null : <Button icon={<CameraOutlined />} shape='default' />}
            </Upload>
          </Form.Item>
        </Col>

        {uploadFile ? null : (
          <Col span={3}>
            <Form.Item className={styles.chatInputFormItem}>
              <GifSelect setGif={sendGif} disabled={false} />
            </Form.Item>
          </Col>
        )}
        {uploadFile ? <Col span={1}></Col> : null}
        <Col span={uploadFile ? 13 : 15}>
          <FormItem className={styles.chatInputFormItem} name='text'>
            <Input.TextArea
              autoFocus
              onPressEnter={preventNewLineWhenPressEnter}
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
