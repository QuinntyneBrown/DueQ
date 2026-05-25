import { HistoryMonth } from './history-month';

export interface History {
  readonly runningBalance: number;
  readonly totalLogged: number;
  readonly totalReceived: number;
  readonly months: readonly HistoryMonth[];
}
