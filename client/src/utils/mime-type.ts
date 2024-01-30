import { MediaType } from '../models/enums/constant';
import { toEnum } from './value-to-enum';

export const isFileType = (fileType?: string) => {
  if (fileType == null) {
    return false;
  }

  return getMediaTypeFromMIME(fileType) === MediaType.File;
};

export const getMediaTypeFromMIME = (mimeType: string) => {
  try {
    return toEnum(mimeType.split('/')[0], MediaType);
  } catch {
    return MediaType.File;
  }
};
