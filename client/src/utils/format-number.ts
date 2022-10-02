export function formatNumber(number: number): string {
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number > 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return `${number}`;
}
