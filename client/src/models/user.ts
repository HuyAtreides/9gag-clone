import { Country } from './enums/country';

export interface User {
  readonly id: number;

  readonly username: string;

  readonly avatarUrl: string;

  readonly displayName: string;

  readonly country: Country | null;

  readonly created: Date;
}
