export interface UserDto {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly country: string;

  readonly created: string;

  readonly followed: boolean;

  readonly isPrivate: boolean;
}
