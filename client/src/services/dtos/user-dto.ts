export interface UserDto {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly country: string;

  readonly created: string;

  readonly followed: boolean;

  readonly isPrivate: boolean;

  readonly receivedFollowRequest: boolean;

  readonly blocked: boolean;

  readonly blockedTime: string | null;

  readonly coverImageUrl: string;

  readonly about: string;

  readonly restricted: boolean;

  readonly restrictedAt: string | null;
}
