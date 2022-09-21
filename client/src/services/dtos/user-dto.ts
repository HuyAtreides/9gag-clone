import SectionDto from './section-dto';

export interface UserDto {
    readonly id: number;

    readonly username: string;

    readonly avatarUrl: string;

    readonly displayName: string;

    readonly country: string;

    readonly favoriteSections: readonly SectionDto[];

    readonly created: string;
}
