import { UploadFile } from 'antd';
import MediaLocation from '../models/media-location';
import { upload } from '../services/upload-service';

export async function getMediaLocationFromForm(uploadFile: UploadFile | undefined) {
  const originFile = uploadFile?.originFileObj;

  const currentMediaLocation =
    uploadFile && !originFile ? uploadFile : { type: null, url: null };
  const mediaLocation = originFile ? await upload(originFile) : currentMediaLocation;

  return mediaLocation as MediaLocation;
}
