// Real, verifiable numbers only (clients served, typical delivery time...).
// While this is empty the stats section is not rendered at all: no
// placeholder numbers on the live site.
export interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

export const STATS: Stat[] = [];
