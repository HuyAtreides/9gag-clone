import { Country } from './enums/country';
import Section from './section';

export interface User {
    readonly id: number;

    readonly username: string;

    readonly avatarUrl: string;

    readonly displayName: string;

    readonly country: Country | null;

    readonly favoriteSections: Section[];

    readonly created: Date;
}
