import { User } from './user';

interface ConversationReadStatus {
  readonly readBy: User;
  readAt: Date;
  latestMessagesRead: boolean;
}

interface ChatConversationConstructorArguments {
  readonly id: number;
  readonly participants: User[];
  readonly read: boolean;
  readonly latestChatMessageId: number;
  readonly readStatuses: ConversationReadStatus[];
}

export default class ChatConversation {
  readonly id: number;
  readonly participants: User[];
  readonly read: boolean;
  readonly latestChatMessageId: number;
  readonly readStatuses: ConversationReadStatus[];

  constructor(constructorArguments: ChatConversationConstructorArguments) {
    this.id = constructorArguments.id;
    this.participants = constructorArguments.participants;
    this.read = constructorArguments.read;
    this.latestChatMessageId = constructorArguments.latestChatMessageId;
    this.readStatuses = constructorArguments.readStatuses;
  }

  getOtherParticipant(currentUser: User) {
    const otherParticipant = this.participants.find(
      (participant) => !participant.equals(currentUser),
    );

    if (!otherParticipant) {
      throw new Error('All participant are the same as current user');
    }

    return otherParticipant;
  }

  markRead(user: User) {
    const userStatus = this.getUserReadStatus(user);
    userStatus.readAt = new Date();
    userStatus.latestMessagesRead = true;
  }

  getOtherReadStatus(currentUser: User | null) {
    const otherReadStatus = this.readStatuses.find(
      (status) => !status.readBy.equals(currentUser),
    );
    if (!otherReadStatus) {
      throw new Error('Invalid read statuses');
    }

    return otherReadStatus;
  }

  getUserReadStatus(user: User) {
    const readStatus = this.readStatuses.find((status) => status.readBy.equals(user));
    if (!readStatus) {
      throw new Error('Invalid read statuses');
    }

    return readStatus;
  }

  isReadByUser(user: User) {
    const readStatus = this.getUserReadStatus(user);

    return readStatus.latestMessagesRead;
  }
}
