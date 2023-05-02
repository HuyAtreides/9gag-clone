import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import { FollowRequestFetchingRequest } from '../models/requests/follow-request-fetching-request';
import { createAxiosInstance } from '../utils/create-axios-instance';
import FollowRequestDto from './dtos/follow-request-dto';
import SliceDto from './dtos/slice-dto';
import { FollowRequestMapper } from './mappers/follow-request-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { SliceMapper } from './mappers/slice-mapper';

export async function acceptFollowRequest(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.FollowRequestEndPoint}/accept/${id}`;
  await axios.put<void>(url);
}

export async function declineFollowRequest(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.FollowRequestEndPoint}/decline/${id}`;
  await axios.put<void>(url);
}

export async function deleteFollowRequest(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.FollowRequestEndPoint}/${id}`;
  await axios.delete<void>(url);
}

export async function cancelFollowRequest(receiverId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.FollowRequestEndPoint}/cancel/${receiverId}`;
  await axios.put<void>(url);
}

export async function sendFollowRequest(userId: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.FollowRequestEndPoint}/send/${userId}`;
  await axios.put<void>(url);
}

export async function getFollowRequest(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.FollowRequestEndPoint}/${id}`;
  const response = await axios.get<FollowRequestDto>(url);

  return FollowRequestMapper.fromDto(response.data);
}

export async function getFollowRequests(fetchRequest: FollowRequestFetchingRequest) {
  const axios = createAxiosInstance();
  const { pageOptions, status, direction } = fetchRequest;
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const config: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url =
    status !== undefined
      ? `${Constant.FollowRequestEndPoint}/direction/${direction}/status/${status}`
      : `${Constant.FollowRequestEndPoint}/direction/${direction}`;
  const response = await axios.get<SliceDto<FollowRequestDto>>(url, config);

  return SliceMapper.fromDto(response.data, FollowRequestMapper.fromDto);
}
