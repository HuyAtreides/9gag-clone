import { NotificationType } from './enums/notification-type';
import { User } from './user';

export default interface Notification {
  readonly id: number;

  readonly type: NotificationType;

  readonly destUrl: string;

  readonly sender: User;

  readonly isViewed: boolean;

  readonly created: Date;

  readonly message: string;
}
