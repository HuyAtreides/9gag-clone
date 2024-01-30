import { NotificationType } from '../../models/enums/notification-type';
import { UserDto } from './user-dto';

export default interface NotificationDto {
  readonly id: number;

  readonly type: NotificationType;

  readonly destUrl: string;

  readonly sender: UserDto;

  readonly isViewed: boolean;

  readonly created: string;

  readonly message: string;
}
