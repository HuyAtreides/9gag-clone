import { CameraOutlined, GifOutlined } from '@ant-design/icons';
import { Button, Col, Comment, Form, Row, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Avatar from 'antd/lib/avatar/avatar';
import TextArea from 'antd/lib/input/TextArea';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import useUploadFile from '../../custom-hooks/upload-file';
import { CommentContext } from '../../features/commment/context/comment-context';
import AppComment from '../../models/comment';
import { CommentUploadFormData } from '../../models/upload-comment-form-data';

import styles from './CommentEditor.module.scss';

interface Props {
  readonly children?: ReactNode;
  readonly comment?: AppComment;
  readonly handleSubmit: (values: CommentUploadFormData) => void;
  readonly handleCancel?: () => void;
}

const CommentEditor: React.FC<Props> = ({
  children,
  comment,
  handleCancel,
  handleSubmit,
}: Props) => {
  const [uploadFile, handleFileChange, setUploadFile] = useUploadFile(
    comment?.getMediaLocation(),
  );
  const [form] = useForm<CommentUploadFormData>();
  const { user } = useContext(CommentContext)!;
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    form.setFieldValue('file', uploadFile ? uploadFile[0] : undefined);
  }, [form, uploadFile]);

  const defaultHandleCancel = () => {
    if (handleCancel) {
      handleCancel();
    } else {
      setUploadFile(undefined);
      form.resetFields();
    }
  };

  const defaultHandleSubmit = async (values: CommentUploadFormData) => {
    setIsUploading(true);
    const result = await Promise.allSettled([handleSubmit(values)]);
    setIsUploading(false);
    const status = result[0].status;

    if (status === 'fulfilled') {
      defaultHandleCancel();
    }
  };

  return (
    <Comment
      avatar={<Avatar src={user.avatarUrl} alt='Han Solo' className='large-icon' />}
      content={
        <Form
          className={styles.commentEditorForm}
          onFinish={defaultHandleSubmit}
          form={form}
          initialValues={{
            text: comment?.text,
          }}
        >
          <Form.Item name='text'>
            <TextArea
              disabled={isUploading}
              className={styles.textArea}
              placeholder='Leave a comment...'
            />
          </Form.Item>
          <Form.Item>
            <Row>
              <Col span={10}>
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
                          <Button
                            icon={<CameraOutlined />}
                            shape='default'
                            disabled={isUploading}
                          />
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item>
                      <Upload>
                        {uploadFile ? null : (
                          <Button
                            icon={<GifOutlined />}
                            shape='default'
                            disabled={isUploading}
                          />
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={14}>
                <Row justify='end' gutter={15}>
                  <Col>
                    <Button
                      type='text'
                      onClick={defaultHandleCancel}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <Button htmlType='submit' type='primary' loading={isUploading}>
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
