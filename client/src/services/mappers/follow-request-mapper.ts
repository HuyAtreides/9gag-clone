import FollowRequest from '../../models/follow-request';
import FollowRequestDto from '../dtos/follow-request-dto';
import { UserMapper } from './user-mapper';

export namespace FollowRequestMapper {
  export function fromDto(data: FollowRequestDto): FollowRequest {
    return {
      ...data,
      created: new Date(data.created),
      receiver: UserMapper.fromDto(data.receiver),
      sender: UserMapper.fromDto(data.sender),
    };
  }
}
