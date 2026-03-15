export function formatGp(value: number): string {
  return `${Math.round(value).toLocaleString()} GP`;
}

export function formatAu(value: number): string {
  return `${value.toFixed(value >= 10 ? 0 : 2)} AU`;
}

export function formatDays(value: number): string {
  if (value < 1) {
    return `${(value * 24).toFixed(1)} hr`;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} days`;
}

export function formatTons(value: number): string {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} tons`;
}

export function titleCaseSupply(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
