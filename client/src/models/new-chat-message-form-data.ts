import { UploadFile } from 'antd';

export type NewChatMessageFormData = {
  readonly text: string | undefined;
  readonly file: UploadFile | undefined;
};
