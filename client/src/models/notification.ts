import { NotificationType } from './enums/notification-type';

export default interface Notification {
  readonly id: number;

  readonly type: NotificationType;

  readonly destUrl: string;

  readonly isViewed: boolean;

  readonly created: Date;

  readonly message: string;
}
