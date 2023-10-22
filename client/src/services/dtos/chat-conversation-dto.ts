import { UserDto } from './user-dto';

export interface ChatConversationDto {
  readonly id: number;
  readonly participants: readonly UserDto[];
  readonly read: boolean;
}
