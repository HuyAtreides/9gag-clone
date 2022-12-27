import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import PageOptions from '../models/page-options';
import { createAxiosInstance } from '../utils/create-axios-instance';
import NotificationDto from './dtos/notification-dto';
import SliceDto from './dtos/slice-dto';
import { NotificationMapper } from './mappers/notification-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { SliceMapper } from './mappers/slice-mapper';

export async function getAllNotifications(pageOptions: PageOptions) {
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axios = createAxiosInstance();
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };

  const response = await axios.get<SliceDto<NotificationDto>>(
    Constant.NotificationEndPoint,
    axiosRequestConfig,
  );

  return SliceMapper.fromDto(response.data, NotificationMapper.fromDto);
}

export async function markNotificationsAsViewed() {
  const axios = createAxiosInstance();
  await axios.put<void>(Constant.NotificationEndPoint);
}

export async function countNotViewedNotifications() {
  const axios = createAxiosInstance();
  const response = await axios.get<number>(
    `${Constant.NotificationEndPoint}/count-not-viewed`,
  );

  return response.data;
}

export async function getLatestNotifications(currentLatestId: number) {
  const axios = createAxiosInstance();
  const axiosRequestConfig: AxiosRequestConfig = {
    params: {
      currentLatestId: currentLatestId,
    },
  };

  const response = await axios.get<NotificationDto[]>(
    `${Constant.NotificationEndPoint}/latest`,
    axiosRequestConfig,
  );

  return response.data.map((notification) => NotificationMapper.fromDto(notification));
}

export async function markSpecificNotificationAsViewed(id: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.NotificationEndPoint}/${id}`);
}

export async function removeAllNotifications() {
  const axios = createAxiosInstance();
  await axios.delete<void>(Constant.NotificationEndPoint);
}
