import { CameraOutlined, GifOutlined } from '@ant-design/icons';
import { Button, Col, Comment, Form, Row, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Avatar from 'antd/lib/avatar/avatar';
import TextArea from 'antd/lib/input/TextArea';
import React, { ReactNode } from 'react';
import useUploadFile from '../../custom-hooks/upload-file';
import AppComment from '../../models/comment';

import { User } from '../../models/user';
import styles from './CommentEditor.module.scss';

interface Props {
  readonly user: User;
  readonly children?: ReactNode[];
  readonly comment?: AppComment;
  readonly handleSubmit?: (values: CommentEditorFormValue) => void;
  readonly handleCancel?: () => void;
}

type CommentEditorFormValue = {
  readonly text: string;
  readonly file: File;
};

const CommentEditor: React.FC<Props> = ({
  user,
  children,
  comment,
  handleCancel,
  handleSubmit,
}: Props) => {
  const [uploadFile, handleFileChange, setUploadFile] = useUploadFile(
    comment ? { url: comment.mediaUrl, type: comment.mediaType } : undefined,
  );
  const [form] = useForm<CommentEditorFormValue>();

  const defaultHandleCancel = () => {
    form.resetFields();
    setUploadFile(undefined);
  };

  const defaultHandleSubmit = () => {};

  return (
    <Comment
      avatar={<Avatar src={user.avatarUrl} alt='Han Solo' className='large-icon' />}
      content={
        <Form
          className={styles.commentEditorForm}
          onFinish={handleSubmit ? handleSubmit : defaultHandleSubmit}
          form={form}
        >
          <Form.Item
            name='text'
            rules={[
              {
                validator: (_, value) => {
                  if (!value.text && !value.file) {
                    throw new Error('Please provide either text or file');
                  }
                },
                message: 'Please provide either text or file',
              },
            ]}
          >
            <TextArea
              className={styles.textArea}
              placeholder='Leave a comment...'
              autoSize={false}
            />
          </Form.Item>
          <Form.Item>
            <Row>
              <Col span={14}>
                <Row gutter={10}>
                  <Col>
                    <Form.Item name='file'>
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
                  <Col>
                    <Form.Item>
                      <Upload>
                        {uploadFile ? null : (
                          <Button icon={<GifOutlined />} shape='default' />
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={10}>
                <Row justify='end' gutter={15}>
                  <Col>
                    <Button
                      type='text'
                      onClick={handleCancel ? handleCancel : defaultHandleCancel}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <Button htmlType='submit' type='primary'>
                      Post
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      }
    >
      {children}
    </Comment>
  );
};

export default CommentEditor;
