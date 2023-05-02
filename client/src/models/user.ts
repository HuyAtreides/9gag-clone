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

  readonly followed: boolean;

  readonly isPrivate: boolean;

  readonly receivedFollowRequest: boolean;
}

export class User {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly country: Country | null;

  readonly created: Date;

  readonly followed: boolean;

  readonly isPrivate: boolean;

  readonly receivedFollowRequest: boolean;

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
  }

  public getMediaLocation(): MediaLocation {
    return {
      url: this.avatarUrl,
      type: MediaType.Image,
    };
  }

  public get countryCode() {
    const countryCode = Object.keys(Country).find(
      (code) => Country[code as keyof typeof Country] === this.country,
    );

    return countryCode;
  }
}
