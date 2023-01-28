export default function isInEnum(
  value: string,
  targetEnum: { [s: string]: unknown },
): boolean {
  return Object.values(targetEnum).includes(value);
}
