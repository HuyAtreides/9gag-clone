import { Country } from './enums/country';

export default interface RegisterData {
  readonly username: string;
  readonly password: string;
  readonly displayName: string;
  readonly email?: string;
  readonly country?: Country;
}
