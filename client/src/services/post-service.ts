import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import NewPost from '../models/new-post';
import Post from '../models/post';
import { PostsFetchingRequest } from '../models/requests/posts-fetching-request';
import { UserSpecificPostFetchingRequest } from '../models/requests/user-specific-posts-fetching-request';
import Slice from '../models/slice';
import { createAxiosInstance } from '../utils/create-axios-instance';
import PostDto from './dtos/post-dto';
import SliceDto from './dtos/slice-dto';
import { NewPostMapper } from './mappers/new-post-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { PostMapper } from './mappers/post-mapper';
import { SliceMapper } from './mappers/slice-mapper';
import { SharePostRequest } from '../models/share-post-request';
import { SharePostRequestMapper } from './mappers/share-post-request-mapper';
import { SharedPostDto } from './dtos/shared-post-dto';
import { SharedPostMapper } from './mappers/shared-post-mapper';

const GET_POSTS_END_POINT = `${Constant.PostEndPoint}`;
const UPVOTE_POST_END_POINT = `${Constant.PostEndPoint}/upvotes`;
const DOWNVOTE_POST_END_POINT = `${Constant.PostEndPoint}/downvotes`;
const UNUPVOTE_POST_END_POINT = `${Constant.PostEndPoint}/unupvotes`;
const UNDOWNVOTE_POST_END_POINT = `${Constant.PostEndPoint}/undownvotes`;

export type PostFetchingFunc<T extends PostsFetchingRequest> = (
  postFetchingRequest: T,
) => Promise<Slice<Post>>;

export async function getSpecificPost(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/${id}`;
  const response = await axios.get<PostDto>(url);

  return PostMapper.fromDto(response.data);
}

export async function savePost(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/save/${id}`;
  await axios.put<void>(url);
}

export async function unSavePost(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/save/${id}`;
  await axios.delete<void>(url);
}

export const getPostList: PostFetchingFunc<PostsFetchingRequest> = async ({
  pageOptions,
  section,
}: PostsFetchingRequest) => {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };

  const url = section
    ? `${GET_POSTS_END_POINT}/section/${section}`
    : `${GET_POSTS_END_POINT}/`;

  const response = await axios.get<SliceDto<PostDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, PostMapper.fromDto);
};

export async function upvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${UPVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}

export async function unUpvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${UNUPVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}
export async function downvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${DOWNVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}

export async function unDownvote(id: number) {
  const axios = createAxiosInstance();
  const url = `${UNDOWNVOTE_POST_END_POINT}/${id}`;
  await axios.put<void>(url);
}

export async function addNewPost(newPost: NewPost) {
  const axios = createAxiosInstance();
  await axios.post<void>(Constant.PostEndPoint, NewPostMapper.toDto(newPost));
}

export async function deletePost(id: number) {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/${id}`;
  await axios.delete<void>(url);
}

export const getSavedPostList: PostFetchingFunc<
  UserSpecificPostFetchingRequest
> = async ({ userId, pageOptions }: UserSpecificPostFetchingRequest) => {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.PostEndPoint}/save/${userId}`;
  const response = await axios.get<SliceDto<PostDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, PostMapper.fromDto);
};

export const getUpvotedPostList = async ({
  userId,
  pageOptions,
}: UserSpecificPostFetchingRequest) => {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.PostEndPoint}/upvote/${userId}`;
  const response = await axios.get<SliceDto<PostDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, PostMapper.fromDto);
};

export const getUserPostList = async ({
  userId,
  pageOptions,
}: UserSpecificPostFetchingRequest) => {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.PostEndPoint}/user/${userId}`;
  const response = await axios.get<SliceDto<PostDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, PostMapper.fromDto);
};

export const followPost = async (id: number) => {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/follow/${id}`;
  await axios.put<void>(url);
};

export const unFollowPost = async (id: number) => {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/unfollow/${id}`;
  await axios.put<void>(url);
};

export const turnOffPostNotifications = async (id: number) => {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/turn-off-notifications/${id}`;
  await axios.put<void>(url);
};

export const turnOnPostNotifications = async (id: number) => {
  const axios = createAxiosInstance();
  const url = `${Constant.PostEndPoint}/turn-on-notifications/${id}`;
  await axios.put<void>(url);
};

export const getFollowingPostList = async ({
  userId,
  pageOptions,
}: UserSpecificPostFetchingRequest) => {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const url = `${Constant.PostEndPoint}/following/${userId}`;
  const response = await axios.get<SliceDto<PostDto>>(url, axiosRequestConfig);

  return SliceMapper.fromDto(response.data, PostMapper.fromDto);
};

export const enablePostAnonymous = async (id: number) => {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.PostEndPoint}/enable-anonymous/${id}`);
};

export const disablePostAnonymous = async (id: number) => {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.PostEndPoint}/disable-anonymous/${id}`);
};

export const sharePost = async (request: SharePostRequest) => {
  const axios = createAxiosInstance();
  const requestDto = SharePostRequestMapper.toDto(request);
  await axios.post<void>(`${Constant.PostEndPoint}/share`, requestDto);
};

export const fetchSharedPost = async (sharedPostContainerId: number) => {
  const axios = createAxiosInstance();
  const response = await axios.get<SharedPostDto>(
    `${Constant.PostEndPoint}/shared/${sharedPostContainerId}`,
  );

  return SharedPostMapper.fromDto(response.data);
};
