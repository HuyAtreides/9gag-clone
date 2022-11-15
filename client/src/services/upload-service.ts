import { Constant } from '../models/enums/constant';
import { createAxiosInstance } from '../utils/create-axios-instance';
import MediaLocationDto from './dtos/media-location-dto';
import { MediaLocationMapper } from './mappers/media-location-mapper';

export const upload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const axios = createAxiosInstance();
  const response = await axios.post<MediaLocationDto>(Constant.UploadEndPoint, formData);

  return MediaLocationMapper.fromDto(response.data);
};
