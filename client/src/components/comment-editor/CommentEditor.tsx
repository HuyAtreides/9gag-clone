import { CameraOutlined, DeleteFilled } from '@ant-design/icons';
import { Button, Col, Comment, Form, Row, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Avatar from 'antd/lib/avatar/avatar';
import React, { ReactNode, useEffect, useState } from 'react';
import useUploadGif from '../../custom-hooks/gif-location';
import useUploadFile from '../../custom-hooks/upload-file';
import AppComment from '../../models/comment';
import { MediaType } from '../../models/enums/constant';
import { CommentUploadFormData } from '../../models/upload-comment-form-data';
import { useAppSelector } from '../../Store';
import GifSelect from '../gif-select/GifSelect';
import GifWrapper from '../gif-wrapper/GifWrapper';

import styles from './CommentEditor.module.scss';
import WYSIWYGEditor from '../wysiwyg-editor/WYSIWYGEditor';

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
  const singleUploadFile = uploadFile && uploadFile[0];
  const [form] = useForm<CommentUploadFormData>();
  const user = useAppSelector((state) => state.user.profile!);
  const [isUploading, setIsUploading] = useState(false);
  const [gifLocation, setGifLocation] = useUploadGif(comment?.getMediaLocation());
  const isGifFile = singleUploadFile?.type === MediaType.Gif;

  useEffect(() => {
    form.setFieldValue('file', singleUploadFile || gifLocation);
  }, [form, singleUploadFile, gifLocation]);

  const defaultHandleCancel = () => {
    if (handleCancel) {
      handleCancel();
    } else {
      setUploadFile(undefined);
      setGifLocation(undefined);
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
      className={styles.commentEditor}
      content={
        <Form
          onFinish={defaultHandleSubmit}
          form={form}
          initialValues={{
            text: comment?.text,
          }}
        >
          <Form.Item name='text'>
            <WYSIWYGEditor height='35vh' />
          </Form.Item>
          <Form.Item>
            <Row>
              <Col span={9}>
                <Row gutter={[5, 5]}>
                  <Col>
                    <Form.Item name='file'>
                      <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={isGifFile ? undefined : uploadFile}
                        listType='picture'
                        onChange={handleFileChange}
                      >
                        {uploadFile || gifLocation ? null : (
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
                      {uploadFile || gifLocation ? null : (
                        <GifSelect setGif={setGifLocation} disabled={isUploading} />
                      )}
                    </Form.Item>
                  </Col>
                  {gifLocation ? (
                    <div className={styles.gifInputContainer}>
                      <GifWrapper mediaLocation={gifLocation} />
                      <Button
                        icon={<DeleteFilled />}
                        type='text'
                        danger
                        onClick={() => setGifLocation(undefined)}
                      />
                    </div>
                  ) : null}
                </Row>
              </Col>
              <Col span={15}>
                <Row justify='end' gutter={[5, 5]}>
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
