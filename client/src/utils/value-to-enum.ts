import { NonFunctional } from './types/non-functional';

/** Convert value to the target enum. */
export function toEnum<T extends object>(
  value: unknown,
  targetEnum: T,
): NonFunctional<T[keyof T]> {
  const keys = Object.keys(targetEnum);
  for (const key of keys) {
    const enumKey = key as keyof T;
    if (targetEnum[enumKey] === value) {
      return targetEnum[enumKey] as NonFunctional<T[keyof T]>;
    }
  }
  throw new Error(`Cannot convert ${value} to ${targetEnum}`);
}
