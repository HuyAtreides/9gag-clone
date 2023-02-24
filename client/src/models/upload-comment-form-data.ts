import { UploadFile } from 'antd';

export type CommentUploadFormData = {
  readonly text: string | undefined;
  readonly file: UploadFile | undefined;
};
