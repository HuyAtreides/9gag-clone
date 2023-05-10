export function abbreviateNumber(number: number) {
  if (number >= 100) {
    return `${99}+`;
  }

  return number;
}
