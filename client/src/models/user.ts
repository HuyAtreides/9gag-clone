import { MediaType } from './enums/constant';
import { Country } from './enums/country';
import MediaLocation from './media-location';

export interface UserConstructorArguments {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly country: Country | null;

  readonly created: Date;

  readonly coverImageUrl: string;

  readonly followed: boolean;

  readonly isPrivate: boolean;

  readonly receivedFollowRequest: boolean;

  readonly blocked: boolean;

  readonly blockedTime: Date | null;

  readonly restricted: boolean;

  readonly restrictedAt: Date | null;

  readonly about: string;

  readonly onlyReceiveMessageFromFollowers: boolean;
}

export class User {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly about: string;

  readonly country: Country | null;

  readonly created: Date;

  readonly followed: boolean;

  readonly isPrivate: boolean;

  readonly receivedFollowRequest: boolean;

  readonly blocked: boolean;

  readonly blockedTime: Date | null;

  readonly coverImageUrl: string;

  readonly restricted: boolean;

  readonly restrictedAt: Date | null;

  readonly onlyReceiveMessageFromFollowers: boolean;

  public constructor(constructorArguments: UserConstructorArguments) {
    this.id = constructorArguments.id;
    this.username = constructorArguments.username;
    this.avatarUrl = constructorArguments.avatarUrl;
    this.country = constructorArguments.country;
    this.created = constructorArguments.created;
    this.displayName = constructorArguments.displayName;
    this.followed = constructorArguments.followed;
    this.isPrivate = constructorArguments.isPrivate;
    this.receivedFollowRequest = constructorArguments.receivedFollowRequest;
    this.blocked = constructorArguments.blocked;
    this.blockedTime = constructorArguments.blockedTime;
    this.coverImageUrl = constructorArguments.coverImageUrl;
    this.about = constructorArguments.about;
    this.restricted = constructorArguments.restricted;
    this.restrictedAt = constructorArguments.restrictedAt;
    this.onlyReceiveMessageFromFollowers =
      constructorArguments.onlyReceiveMessageFromFollowers;
  }

  public getAvatarLocation(): MediaLocation {
    return {
      url: this.avatarUrl,
      type: MediaType.Image,
    };
  }

  public getCoverImgLocation(): MediaLocation {
    return {
      url: this.coverImageUrl,
      type: MediaType.Image,
    };
  }

  public get countryCode() {
    const countryCode = Object.keys(Country).find(
      (code) => Country[code as keyof typeof Country] === this.country,
    );

    return countryCode;
  }

  public equals(otherUser: User | null) {
    if (otherUser == null) {
      return false;
    }

    return otherUser.id === this.id;
  }
}
