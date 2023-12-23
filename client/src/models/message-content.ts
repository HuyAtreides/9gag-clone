import { UploadFile } from 'antd';

export interface MessageContent {
  readonly mediaUrl: string | null;
  readonly mediaType: string | null;
  readonly text: string | null;
  readonly uploadFile?: UploadFile;
}
