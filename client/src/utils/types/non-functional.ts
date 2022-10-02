/** Represents a type that cannot be a Function. */
export type NonFunctional<T> = T extends Function ? never : T;
