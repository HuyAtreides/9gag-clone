type UserSource = {
  readonly id: string;
};

type UserMetadata = {
  readonly sources: UserSource[];
};

type UserEmail = {
  readonly value: string;
};

type UserName = {
  readonly displayName: string;
};

type UserPhoto = {
  readonly url: string;
};

type UserAddress = {
  readonly country: string;
  readonly countryCode: string;
};

export default interface GoogleUserProfile {
  readonly metadata: UserMetadata;
  readonly emailAddresses: UserEmail[];
  readonly names: UserName[];
  readonly photos: UserPhoto[];
  readonly address?: UserAddress[];
}
