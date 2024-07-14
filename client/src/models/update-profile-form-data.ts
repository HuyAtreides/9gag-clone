import { UploadFile } from 'antd';
import { Country } from './enums/country';

export interface UpdateProfileFormData {
  readonly avatar?: UploadFile;
  readonly coverImg?: UploadFile;
  readonly username: string;
  readonly displayName: string;
  readonly country: Country | null;
  readonly isPrivate: boolean;
  readonly about: string;
  readonly email?: string;
  readonly onlyReceiveMessageFromFollowers: boolean;
}
