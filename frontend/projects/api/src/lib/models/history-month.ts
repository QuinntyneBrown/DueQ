import { HistoryEntry } from './history-entry';

export interface HistoryMonth {
  readonly year: number;
  readonly month: number;
  readonly monthDelta: number;
  readonly entries: readonly HistoryEntry[];
}
