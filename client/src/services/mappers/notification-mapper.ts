import Notification from '../../models/notification';
import NotificationDto from '../dtos/notification-dto';
import { UserMapper } from './user-mapper';

export namespace NotificationMapper {
  export function fromDto(data: NotificationDto): Notification {
    return {
      ...data,
      sender: UserMapper.fromDto(data.sender),
      created: new Date(data.created),
    };
  }
}
