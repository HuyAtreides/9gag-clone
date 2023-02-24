export type Mutable<ImmutableType> = {
  -readonly [key in keyof ImmutableType]: ImmutableType[key];
};
