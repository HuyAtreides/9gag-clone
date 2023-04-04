import { Country } from './enums/country';

export interface UserConstructorArguments {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly country: Country | null;

  readonly created: Date;

  readonly followed: boolean;
}

export class User {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly country: Country | null;

  readonly created: Date;

  readonly followed: boolean;

  public constructor(constructorArguments: UserConstructorArguments) {
    this.id = constructorArguments.id;
    this.username = constructorArguments.username;
    this.avatarUrl = constructorArguments.avatarUrl;
    this.country = constructorArguments.country;
    this.created = constructorArguments.created;
    this.displayName = constructorArguments.displayName;
    this.followed = constructorArguments.followed;
  }

  public get countryCode() {
    const countryCode = Object.keys(Country).find(
      (code) => Country[code as keyof typeof Country] === this.country,
    );

    return countryCode;
  }
}
