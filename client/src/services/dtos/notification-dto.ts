import { NotificationType } from '../../models/enums/notification-type';

export default interface NotificationDto {
  readonly id: number;

  readonly type: NotificationType;

  readonly destUrl: string;

  readonly isViewed: boolean;

  readonly created: string;

  readonly message: string;
}
