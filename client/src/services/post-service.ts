import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import PageOptions from '../models/page-options';
import Post from '../models/post';
import Slice from '../models/slice';
import { createAxiosInstance } from '../utils/create-axios-instance';
import PostDto from './dtos/post-dto';
import SliceDto from './dtos/slice-dto';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { PostMapper } from './mappers/post-mapper';
import { SliceMapper } from './mappers/slice-mapper';

const GET_POSTS_END_POINT = `${Constant.PostEndPoint}/tag`;

export async function getPostList(
  pageOptions: PageOptions,
  tag: string,
  section?: string,
) {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };

  const url = section
    ? `${GET_POSTS_END_POINT}/${tag}/${section}`
    : `${GET_POSTS_END_POINT}/${tag}`;

  const response = await axios.get<SliceDto<PostDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, PostMapper.fromDto);
}
