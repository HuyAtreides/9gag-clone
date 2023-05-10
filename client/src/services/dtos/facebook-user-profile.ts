type UserPicture = {
  readonly data: {
    readonly url: string;
  };
};

export default interface FacebookUserProfile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly picture: UserPicture;
}
