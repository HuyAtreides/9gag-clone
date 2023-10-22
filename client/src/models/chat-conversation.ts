import { User } from './user';

export default interface ChatConversation {
  readonly id: number;
  readonly participants: readonly User[];
  readonly read: boolean;
}
