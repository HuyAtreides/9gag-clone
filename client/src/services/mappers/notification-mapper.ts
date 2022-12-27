import Notification from '../../models/notification';
import NotificationDto from '../dtos/notification-dto';

export namespace NotificationMapper {
  export function fromDto(data: NotificationDto): Notification {
    return {
      ...data,
      created: new Date(data.created),
    };
  }
}
